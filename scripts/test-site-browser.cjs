const { chromium } = require('../frontend/node_modules/playwright');
const assert = require('node:assert/strict');
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');

async function main() {
  const base = (process.env.DEMO_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const output = join(__dirname, '..', 'test-results', 'site-browser');
  mkdirSync(output, { recursive: true });
  try {
    for (const viewport of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 360, height: 800 },
    ]) {
      const context = await browser.newContext({ viewport, isMobile: viewport.name === 'mobile' });
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const browserErrors = [];
      page.on('pageerror', error => browserErrors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error' && /TypeError|ReferenceError|Minified React error|Uncaught /i.test(message.text())) {
          browserErrors.push(message.text());
        }
      });
      page.on('response', response => {
        if (response.url().startsWith(`${base}/api/`) && response.status() >= 500) {
          browserErrors.push(`HTTP ${response.status()} ${response.url()}`);
        }
      });

      async function check(name, action) {
        browserErrors.length = 0;
        try {
          await action();
          assert.deepEqual(browserErrors, [], 'Browser must not encounter runtime errors or API server errors');
          console.log(`PASS browser ${viewport.name}: ${name}`);
        } catch (error) {
          const screenshot = join(output, `${viewport.name}-${name.replace(/[^a-z0-9]+/gi, '-')}.png`);
          await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
          failures.push(`${viewport.name}: ${name}: ${error.message}${browserErrors.length ? `\nBrowser errors: ${browserErrors.join('; ')}` : ''}`);
          console.error(`FAIL browser ${viewport.name}: ${name}; screenshot: ${screenshot}`);
        }
      }

      async function noHorizontalOverflow() {
        const dimensions = await page.evaluate(() => ({
          viewport: window.innerWidth,
          document: document.documentElement.scrollWidth,
        }));
        assert(dimensions.document <= dimensions.viewport + 1,
          `Horizontal overflow: page ${dimensions.document}px, viewport ${dimensions.viewport}px`);
      }

      await check('menu', async () => {
        await page.goto(`${base}/menu`);
        await page.getByText('Демо: пицца Маргарита', { exact: true }).waitFor();
        await page.getByText('Демо: лимонад', { exact: true }).waitFor();
        await noHorizontalOverflow();
      });

      await check('catalog category', async () => {
        await page.goto(`${base}/categories`);
        await page.getByRole('link', { name: 'Демо-меню', exact: true }).click();
        await page.waitForURL(/\/categories\/\d+$/);
        await page.getByRole('heading', { name: 'Демо-меню', exact: true }).waitFor();
        await page.getByText('Демо: пицца Маргарита', { exact: true }).waitFor();
        assert.equal(await page.getByText('Спагетти Карбонара', { exact: true }).count(), 0,
          'Category page must not contain products from a different category');
        await noHorizontalOverflow();
      });

      await check('search and empty result', async () => {
        await page.goto(`${base}/menu`);
        const search = page.getByPlaceholder('Поиск', { exact: true });
        await search.fill('Демо: пицца');
        await search.press('Enter');
        await page.waitForURL('**/menu/search');
        await page.getByRole('heading', { name: 'Результат поиска', exact: true }).waitFor();
        await page.getByText('Демо: пицца Маргарита', { exact: true }).waitFor();
        // Wait for the debounce-backed request, rather than accepting stale menu data.
        await page.waitForFunction(() => !document.body.innerText.includes('Демо: лимонад'));
        await search.fill('no-such-demo-product-719310042');
        await search.press('Enter');
        await page.getByText('К сожалению, ничего не найдено', { exact: true }).waitFor();
        await noHorizontalOverflow();
      });

      await check('product detail and reload', async () => {
        await page.goto(`${base}/menu`);
        await page.getByText('Демо: пицца Маргарита', { exact: true }).click();
        await page.waitForURL(/\/menu\/\d+$/);
        await page.getByRole('heading', { name: 'Демо: пицца Маргарита', exact: true }).waitFor();
        await page.getByText('Синтетические данные демонстрационного стенда', { exact: true }).waitFor();
        await page.getByText('590₽', { exact: true }).waitFor();
        await noHorizontalOverflow();
        await page.reload();
        await page.getByRole('heading', { name: 'Демо: пицца Маргарита', exact: true }).waitFor();
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  assert.equal(failures.length, 0, failures.join('\n\n'));
  console.log('PASS browser site: desktop/mobile menu, categories, search, empty result, product details and deep-link reload');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
