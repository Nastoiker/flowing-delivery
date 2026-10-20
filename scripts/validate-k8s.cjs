// Локальная проверка связей ресурсов. Не заменяет проверку схемы API и запуск стенда.
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');
const assert = require('node:assert/strict');
const YAML = require('../delivery-service/node_modules/yaml');
const root = join(__dirname, '..');
const rendered = execFileSync('kubectl', ['kustomize', join(root, 'k8s')], { encoding: 'utf8' });
const resources = YAML.parseAllDocuments(rendered).map(d => {
  assert.equal(d.errors.length, 0, 'Invalid YAML');
  return d.toJSON();
});
const namespace = 'flowing-delivery-lab';
const byKind = kind => resources.filter(r => r.kind === kind);
const configs = new Set(byKind('ConfigMap').map(r => r.metadata.name));
const pvcs = new Set(byKind('PersistentVolumeClaim').map(r => r.metadata.name));
const workloads = resources.filter(r => ['Deployment', 'StatefulSet'].includes(r.kind));
const knownSecretKeys = new Set(['JWT_SECRET', 'AMQP_PASSWORD', 'DB_PASSWORD']);
assert.equal(byKind('Secret').length, 0, 'Credentials must not be embedded in manifests');
assert.equal(new Set(resources.map(r => r.kind + '/' + r.metadata.name)).size, resources.length);
for (const r of resources) {
  if (r.kind !== 'Namespace') assert.equal(r.metadata.namespace, namespace);
}
for (const w of workloads) {
  const spec = w.spec.template.spec;
  assert.equal(spec.automountServiceAccountToken, false);
  for (const [key, value] of Object.entries(w.spec.selector.matchLabels)) {
    assert.equal(w.spec.template.metadata.labels[key], value, 'Selector mismatch');
  }
  const volumeNames = new Set([
    ...(spec.volumes || []).map(v => v.name),
    ...(w.spec.volumeClaimTemplates || []).map(v => v.metadata.name),
  ]);
  for (const v of spec.volumes || []) {
    if (v.configMap) assert(configs.has(v.configMap.name), 'Missing ConfigMap');
    if (v.persistentVolumeClaim) assert(pvcs.has(v.persistentVolumeClaim.claimName), 'Missing PVC');
  }
  for (const c of [...(spec.initContainers || []), ...spec.containers]) {
    assert(c.resources?.requests?.memory && c.resources?.limits?.memory, 'Missing resource budget');
    for (const v of c.volumeMounts || []) assert(volumeNames.has(v.name), 'Missing mounted volume');
    for (const env of c.envFrom || []) {
      if (env.configMapRef) assert(configs.has(env.configMapRef.name), 'Missing env ConfigMap');
    }
    for (const env of c.env || []) {
      if (env.valueFrom?.secretKeyRef) {
        assert.equal(env.valueFrom.secretKeyRef.name, 'delivery-secrets');
        assert(knownSecretKeys.has(env.valueFrom.secretKeyRef.key), 'Unknown Secret key');
      }
    }
    if (c.image.startsWith('flowing-delivery-')) assert.equal(c.imagePullPolicy, 'Never');
    for (const probe of [c.startupProbe, c.readinessProbe, c.livenessProbe].filter(Boolean)) {
      const port = probe.httpGet?.port || probe.tcpSocket?.port;
      if (port) assert((c.ports || []).some(p => p.containerPort === port), 'Probe port not declared');
    }
  }
}
for (const svc of byKind('Service')) {
  const selected = workloads.filter(w => Object.entries(svc.spec.selector).every(
    ([k, v]) => w.spec.template.metadata.labels[k] === v));
  assert(selected.length, 'Service selects no workload: ' + svc.metadata.name);
  const ports = selected.flatMap(w => w.spec.template.spec.containers.flatMap(c => c.ports || []));
  for (const p of svc.spec.ports) assert(ports.some(c => c.containerPort === p.targetPort), 'Service target port mismatch');
}
const api = workloads.find(w => w.metadata.name === 'api');
assert.equal(api.spec.replicas, 1, 'API socket map is process-local');
assert.equal(api.spec.strategy.type, 'Recreate', 'Uploads PVC requires a deliberate rollout strategy');
const queues = workloads.flatMap(w => w.spec.template.spec.containers.flatMap(c =>
  (c.env || []).filter(e => e.name === 'AMQP_QUEUE').map(e => e.value)));
assert.equal(new Set(queues).size, queues.length, 'Consumers must not accidentally share a queue');
console.log('Validated ' + resources.length + ' resources: selectors, ports, mounts, config/secret references and queue isolation.');
