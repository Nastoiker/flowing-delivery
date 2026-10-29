const assert = require('node:assert/strict');
const { setTimeout: delay } = require('node:timers/promises');

async function retry(url, verify) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
      await verify(response);
      console.log(`PASS ${url}`);
      return;
    } catch (error) { lastError = error; }
    await delay(2000);
  }
  throw lastError;
}

async function main() {
  await retry('http://127.0.0.1:5173/menu', async response => {
    assert.match(await response.text(), /<div id="root"><\/div>/);
  });
  await retry('http://127.0.0.1:3444/api/categories', async response => {
    const body = await response.json();
    assert(Array.isArray(body.categories) && body.categories.length > 0,
      'Expected nonempty seeded categories from account');
    assert(body.categories.every(category => Number.isInteger(category.id) && typeof category.name === 'string'),
      'Category contract mismatch');
  });
}
main().catch(error => { console.error(error); process.exitCode = 1; });
