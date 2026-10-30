const assert = require('node:assert/strict');
async function main() {
  const base = process.env.DEMO_URL || 'http://127.0.0.1:5173';
  const page = await fetch(`${base}/menu`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<div id="root"><\/div>/);
  const response = await fetch(`${base}/api/categories`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert(body.categories.some(category => category.slug === 'demo-menu-v1'), 'Demo catalog is missing');
  const socket = await fetch(`${base}/socket.io/?EIO=4&transport=polling`);
  assert.equal(socket.status, 200);
  assert.match(await socket.text(), /^0\{"sid":/);
  console.log('PASS: frontend, API demo data and Socket.IO through a single origin');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
