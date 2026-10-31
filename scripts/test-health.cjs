const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const { setTimeout: delay } = require('node:timers/promises');
const base = process.env.DEMO_URL || 'http://127.0.0.1:5173';
const compose = (...args) => execFileSync('docker', ['compose', '--env-file', '.demo.local.env', '-f', 'docker-compose.demo.yml', ...args], { stdio: 'inherit' });
async function check(endpoint, expected) {
  const response = await fetch(`${base}/api/health/${endpoint}`, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, expected, `${endpoint} status`);
  return response.json();
}
async function main() {
  await check('ready', 200);
  try {
    compose('stop', 'account');
    const body = await check('ready', 503);
    assert.equal(body.status, 'unavailable');
    await check('live', 200);
    console.log('PASS: missing account -> readiness 503; liveness stays 200');
  } finally { compose('start', 'account'); }
  for (let attempt = 0; attempt < 60; attempt++) {
    try { await check('ready', 200); console.log('PASS: readiness recovered'); return; }
    catch (error) { if (attempt === 59) throw error; await delay(1000); }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
