const { chromium } = require('../frontend/node_modules/playwright');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

async function main() {
  const base = process.env.DEMO_URL || 'http://127.0.0.1:5173';
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const email = `browser-${randomUUID()}@example.invalid`;
    const password = randomUUID();
    await page.goto(`${base}/auth/register`);
    await page.getByRole('button', { name: 'Зарегистрироваться', exact: true }).click();
    await page.getByText('Заполните email', { exact: true }).waitFor();
    await page.getByLabel('Ваш email', { exact: true }).fill(email);
    await page.getByLabel('Ваш пароль', { exact: true }).fill(password);
    await page.getByLabel('Ваше имя', { exact: true }).fill('Damir');
    await page.getByLabel('Ваша фамилия', { exact: true }).fill('Test-Buyer');
    await page.getByLabel('Ваше пользовательское имя', { exact: true }).fill('browser-demo');
    await page.getByLabel('Я согласен на обработку персональных данных').check();
    await page.getByRole('button', { name: 'Зарегистрироваться', exact: true }).click();
    await page.waitForURL('**/auth/login');
    await page.getByText('Аккаунт создан. Войдите с вашим паролем.').waitFor();
    assert.equal(await page.getByLabel('Ваш email', { exact: true }).inputValue(), email);
    await page.getByLabel('Ваш пароль', { exact: true }).fill('incorrect-password');
    await page.getByRole('button', { name: 'Войти', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: /Неверный/ }).waitFor();
    await page.getByLabel('Ваш пароль', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Войти', exact: true }).click();
    await page.waitForURL('**/menu');
    assert(await page.evaluate(() => !!localStorage.getItem('token')));
    const identity = await page.evaluate(async () => {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } });
      return { status: response.status, body: await response.json() };
    });
    assert.equal(identity.status, 200);
    assert(JSON.stringify(identity.body).includes(email), 'Login must authenticate the newly registered user');
    console.log('PASS browser: visible validation, Latin/hyphenated names, registration, wrong-password feedback and login');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
