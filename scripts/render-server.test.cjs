const { test } = require('node:test');
const assert = require('node:assert/strict');
const { render } = require('./render-server.cjs');
const YAML = require('../delivery-service/node_modules/yaml');
const sha = 'a'.repeat(40);
test('replaces both init and application images without modifying infrastructure', () => {
  const source = YAML.stringify({ kind: 'Deployment', spec: { template: { spec: {
    initContainers: [{ image: 'flowing-delivery-backend:senior', imagePullPolicy: 'Never' }],
    containers: [{ image: 'flowing-delivery-frontend:senior', imagePullPolicy: 'Never' }, { image: 'postgres:16-bookworm' }],
  } } } });
  const spec = YAML.parse(render(source, `ghcr.io/test/backend:${sha}`, `ghcr.io/test/frontend:${sha}`)).spec.template.spec;
  assert.equal(spec.initContainers[0].image, `ghcr.io/test/backend:${sha}`);
  assert.equal(spec.containers[0].imagePullPolicy, 'IfNotPresent');
  assert.equal(spec.containers[1].image, 'postgres:16-bookworm');
  assert.deepEqual(spec.imagePullSecrets, [{ name: 'ghcr-pull' }]);
});
test('rejects mutable tags and malformed image names', () => {
  assert.throws(() => render('', 'ghcr.io/test/backend:latest', `ghcr.io/test/frontend:${sha}`));
  assert.throws(() => render('', '$(command)', `ghcr.io/test/frontend:${sha}`));
});
