const { execFileSync } = require('node:child_process');
const YAML = require('../delivery-service/node_modules/yaml');

function render(source, backend, frontend) {
  for (const image of [backend, frontend]) {
    if (!/^ghcr\.io\/[a-z0-9._/-]+:[a-f0-9]{40}$/.test(image)) {
      throw new Error('Expected a GHCR image tagged with a full commit SHA');
    }
  }
  const documents = YAML.parseAllDocuments(source);
  const rendered = [];
  for (const document of documents) {
    if (document.errors.length) throw document.errors[0];
    const value = document.toJSON();
    const spec = value.spec?.template?.spec;
    if (spec) {
      let usesRegistry = false;
      for (const container of [...(spec.initContainers || []), ...spec.containers]) {
        if (container.image === 'flowing-delivery-backend:senior') {
          container.image = backend;
          usesRegistry = true;
        } else if (container.image === 'flowing-delivery-frontend:senior') {
          container.image = frontend;
          usesRegistry = true;
        } else continue;
        container.imagePullPolicy = 'IfNotPresent';
      }
      if (usesRegistry) spec.imagePullSecrets = [{ name: 'ghcr-pull' }];
    }
    rendered.push(YAML.stringify(value));
  }
  return rendered.join('---\n');
}

if (require.main === module) {
  const source = execFileSync('kubectl', ['kustomize', 'k8s'], { encoding: 'utf8' });
  process.stdout.write(render(source, process.argv[2], process.argv[3]));
}
module.exports = { render };
