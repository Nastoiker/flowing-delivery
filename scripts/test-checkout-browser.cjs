const { chromium } = require('../frontend/node_modules/playwright');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

async function main() {
  const base = (process.env.DEMO_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`${base}/api/categories`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) break;
    } catch { /* The local demo can be restarting during deployment. */ }
    if (attempt === 29) throw new Error('Demo API did not become ready');
    await delay(1000);
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (process.env.DEBUG_CHECKOUT && response.url().startsWith(`${base}/api/`)) {
      console.log(response.request().method(), response.status(), new URL(response.url()).pathname);
    }
    if (response.url().startsWith(`${base}/api/`) && response.status() >= 500) {
      errors.push(`HTTP ${response.status()} ${response.url()}`);
    }
  });
  try {
    const email = `checkout-${randomUUID()}@example.invalid`;
    const password = randomUUID();
    const registration = await context.request.post(`${base}/api/auth/register`, {
      data: { email, password, name: 'Checkout', surname: 'Browser-Test', username: 'checkout-demo' },
    });
    assert.equal(registration.status(), 201, `Synthetic user registration: ${await registration.text()}`);
    const login = await context.request.post(`${base}/api/auth/login`, { data: { email, password } });
    assert.equal(login.status(), 201);
    const { access_token: token } = await login.json();
    assert(token, 'Test account must receive an authentication token');
    await context.addInitScript(value => localStorage.setItem('token', JSON.stringify(value)), token);

    await page.goto(`${base}/menu`);
    await page.getByRole('button', { name: /Уведомления, непрочитанных:/ }).waitFor();
    const title = 'Демо: лимонад';
    const card = page.locator('.MuiCard-root').filter({ has: page.getByText(title, { exact: true }) });
    await card.waitFor();
    const add = card.getByRole('button', { name: `Добавить в корзину: ${title}`, exact: true });
    assert(await add.isEnabled(), 'In-stock demo lemonade must be addable to the cart by an authenticated buyer');
    const [addResponse] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname.replace(/\/$/, '') === '/api/shopping-cart' && response.request().method() === 'POST'),
      add.click(),
    ]);
    assert(addResponse.ok(), `Add to cart failed: HTTP ${addResponse.status()} ${await addResponse.text()}`);

    await page.goto(`${base}/shopping-cart`);
    await page.getByText(title, { exact: true }).waitFor();
    await page.getByText('Итог: 190₽', { exact: true }).waitFor();
    // Only pickup is tested: no external address service and no real payment.
    const pickup = page.getByRole('checkbox').first();
    await pickup.check();
    const rejectionMessage = 'Тест: заказ отклонён, повторите попытку';
    const orderEndpoint = `${base}/api/order`;
    await page.route(orderEndpoint, async route => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ message: rejectionMessage }) });
    });
    await page.getByRole('button', { name: /оформить/i }).click();
    await page.getByText(rejectionMessage, { exact: true }).waitFor();
    assert.equal(await page.getByText('Успешное создание', { exact: true }).count(), 0, 'Rejected checkout must not show success');
    assert(await page.getByText(title, { exact: true }).isVisible(), 'Rejected checkout must preserve the basket');
    await page.getByText('Итог: 190₽', { exact: true }).waitFor();
    await page.unroute(orderEndpoint);
    console.log('PASS checkout rejection: visible error, no success toast, basket preserved');
    const [orderResponse] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname.replace(/\/$/, '') === '/api/order' && response.request().method() === 'POST'),
      page.getByRole('button', { name: /оформить/i }).click(),
    ]);
    assert(orderResponse.ok(), `Checkout failed: HTTP ${orderResponse.status()} ${await orderResponse.text()}`);
    const created = await orderResponse.json();
    assert(created.order?.id, 'Checkout must return the created order');
    assert.equal(created.order.isPickUp, true);
    assert.equal(Number(created.order.totalPrice), 190);
    await page.getByText('В вашей корзине пока пусто', { exact: true }).waitFor();

    await page.goto(`${base}/profile`);
    await page.getByRole('tab', { name: 'Ваши заказы', exact: true }).click();
    const orders = await page.evaluate(async () => {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await fetch('/api/order/my', { headers: { Authorization: `Bearer ${token}` } });
      return { status: response.status, body: await response.json() };
    });
    assert.equal(orders.status, 200);
    assert(orders.body.orders.some(order => order.id === created.order.id), 'My orders must include the newly created order');
    await page.getByRole('tabpanel').filter({ visible: true }).getByText(title, { exact: true }).waitFor();
    assert.deepEqual(errors, [], 'Checkout must not produce browser runtime errors or API server errors');
    console.log(`PASS browser checkout: authenticated buyer, one demo item, pickup order #${created.order.id}, empty cart and profile order history`);
  } catch (error) {
    const output = join(__dirname, '..', 'test-results', 'checkout-browser');
    mkdirSync(output, { recursive: true });
    await page.screenshot({ path: join(output, 'failure.png'), fullPage: true }).catch(() => {});
    if (errors.length) console.error('Browser errors:', errors);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
