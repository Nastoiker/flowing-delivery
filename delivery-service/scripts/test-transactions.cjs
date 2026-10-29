const { spawnSync } = require('node:child_process');
const { join } = require('node:path');
if (!process.env.TRANSACTION_TEST_DATABASE_URL) {
  console.error(
    'Укажи TRANSACTION_TEST_DATABASE_URL для одноразовой локальной БД. См. docs/TRANSACTIONS_LAB.md.'
  );
  process.exit(1);
}
const result = spawnSync(
  process.execPath,
  [
    require.resolve('jest/bin/jest'),
    '--config',
    'apps/account/jest.config.ts',
    '--runInBand',
    '--runTestsByPath',
    'apps/account/src/app/order/place-order.integration.spec.ts',
    'apps/account/src/app/order/saga/checkout-saga.integration.spec.ts',
    ...process.argv.slice(2),
  ],
  { cwd: join(__dirname, '..'), stdio: 'inherit' }
);
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
