import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { QueryTypes, Sequelize } from 'sequelize';
import { CheckoutParticipant, CheckoutSaga } from './checkout-saga';

const databaseUrl = process.env.TRANSACTION_TEST_DATABASE_URL;
const input = { orderId: 1, amountMinor: 12550, currency: 'RUB' as const };

(databaseUrl ? describe : describe.skip)(
  'Durable checkout saga (PostgreSQL)',
  () => {
    let db: Sequelize;
    let saga: CheckoutSaga;
    let participants: Record<
      'inventory' | 'payment' | 'fulfillment',
      CheckoutParticipant
    >;

    beforeAll(async () => {
      const url = new URL(databaseUrl);
      if (
        !['localhost', '127.0.0.1'].includes(url.hostname) ||
        url.pathname !== '/delivery_transactions_test'
      )
        throw new Error('Disposable local database required');
      db = new Sequelize(databaseUrl, {
        logging: false,
        pool: { max: 8, min: 0 },
        dialectOptions: {
          options: '-c search_path=checkout_saga_test',
          statement_timeout: 15000,
        },
      });
      await db.query('CREATE SCHEMA IF NOT EXISTS checkout_saga_test');
      await db.query(
        readFileSync(
          resolve(
            __dirname,
            '../../../../../../migrations/001-checkout-saga.sql'
          ),
          'utf8'
        )
      );
      // Test adapters simulate local participant transactions. Their durable inbox
      // and business effect are one commit, independent of the orchestrator commit.
      await db.query(`CREATE TABLE IF NOT EXISTS participant_effects (
      key text PRIMARY KEY, participant text NOT NULL, effect integer NOT NULL,
      result text NOT NULL CHECK (result IN ('accepted', 'rejected')))`);
    });

    beforeEach(async () => {
      await db.query(
        'TRUNCATE checkout_saga_events, checkout_sagas, participant_effects'
      );
      const adapter = (name: string): CheckoutParticipant => ({
        async execute(_input, key) {
          await db.query(
            `INSERT INTO participant_effects VALUES ($1, $2, 1, 'accepted')
          ON CONFLICT (key) DO NOTHING`,
            { bind: [key, name] }
          );
          const [row] = await db.query<{ result: 'accepted' | 'rejected' }>(
            'SELECT result FROM participant_effects WHERE key = $1',
            { bind: [key], type: QueryTypes.SELECT }
          );
          return row.result;
        },
        async compensate(_input, key) {
          await db.query(
            `INSERT INTO participant_effects VALUES ($1, $2, -1, 'accepted')
          ON CONFLICT (key) DO NOTHING`,
            { bind: [key, name] }
          );
        },
      });
      participants = {
        inventory: adapter('inventory'),
        payment: adapter('payment'),
        fulfillment: adapter('fulfillment'),
      };
      saga = new CheckoutSaga(db, participants);
    });

    afterAll(async () => {
      if (db) await db.close();
    });

    async function balance(participant: string) {
      const [row] = await db.query<{ total: string }>(
        'SELECT COALESCE(sum(effect), 0) AS total FROM participant_effects WHERE participant = $1',
        { bind: [participant], type: QueryTypes.SELECT }
      );
      return Number(row.total);
    }

    it('completes once under concurrent starts and workers, with a single audit history', async () => {
      await Promise.all(
        Array.from({ length: 8 }, () => saga.start('same', input))
      );
      const outcomes = await Promise.all(
        Array.from({ length: 8 }, () => saga.resume('same'))
      );
      expect(outcomes.every((row) => row.status === 'completed')).toBe(true);
      expect(await balance('payment')).toBe(1);
      expect(await balance('inventory')).toBe(1);
      const events = await db.query(
        'SELECT version FROM checkout_saga_events ORDER BY version',
        { type: QueryTypes.SELECT }
      );
      expect(events).toEqual([{ version: 1 }, { version: 2 }, { version: 3 }]);
    });

    it('rejects changed payload and a second saga for the same order', async () => {
      await saga.start('first', input);
      await expect(
        saga.start('first', { ...input, amountMinor: 1 })
      ).rejects.toThrow('different input');
      await expect(saga.start('second', input)).rejects.toThrow();
    });

    it.each([0, -1, 1.1, Number.MAX_SAFE_INTEGER + 1])(
      'rejects invalid money %s',
      async (amountMinor) => {
        await expect(
          saga.start('invalid', { ...input, amountMinor })
        ).rejects.toThrow('Invalid checkout');
      }
    );

    it('releases inventory on a definite payment rejection', async () => {
      participants.payment.execute = async () => 'rejected';
      await saga.start('declined', input);
      expect((await saga.resume('declined')).status).toBe('cancelled');
      expect(await balance('inventory')).toBe(0);
      expect(await balance('payment')).toBe(0);
    });

    it('cancels without compensation when inventory rejects', async () => {
      participants.inventory.execute = async () => 'rejected';
      await saga.start('no-stock', input);
      expect((await saga.resume('no-stock')).status).toBe('cancelled');
      expect(await balance('payment')).toBe(0);
    });

    it('recovers after payment committed but its response was lost, without a double charge', async () => {
      const execute = participants.payment.execute;
      participants.payment.execute = async (payload, key) => {
        await execute(payload, key);
        throw new Error('Connection lost after commit');
      };
      await saga.start('crash', input);
      await expect(saga.resume('crash')).rejects.toThrow('Connection lost');
      expect((await saga.inspect('crash')).status).toBe('running');
      expect(await balance('inventory')).toBe(1); // Unknown payment outcome is not a decline.
      participants.payment.execute = execute;
      const restarted = new CheckoutSaga(db, participants);
      expect((await restarted.recover())[0].status).toBe('fulfilled');
      expect((await restarted.inspect('crash')).status).toBe('completed');
      expect(await balance('payment')).toBe(1);
    });

    it('rolls back state if audit persistence fails, then safely retries the effect', async () => {
      await saga.start('audit-failure', input);
      await db.query(
        `ALTER TABLE checkout_saga_events ADD CONSTRAINT injected_failure CHECK (version < 1)`
      );
      try {
        await expect(saga.resume('audit-failure')).rejects.toThrow();
        expect((await saga.inspect('audit-failure')).version).toBe(0);
        expect(await balance('inventory')).toBe(1);
      } finally {
        await db.query(
          'ALTER TABLE checkout_saga_events DROP CONSTRAINT injected_failure'
        );
      }
      expect(
        (await new CheckoutSaga(db, participants).resume('audit-failure'))
          .status
      ).toBe('completed');
      expect(await balance('inventory')).toBe(1);
    });

    it('does not let a failing instance stop other instances in a recovery batch', async () => {
      const execute = participants.payment.execute;
      participants.payment.execute = async (payload, key) => {
        if (payload.orderId === 1) throw new Error('Provider unavailable');
        return execute(payload, key);
      };
      await saga.start('unavailable', input);
      await saga.start('healthy', { ...input, orderId: 2 });
      const results = await saga.recover();
      expect(results.map((result) => result.status)).toEqual([
        'rejected',
        'fulfilled',
      ]);
      expect((await saga.inspect('unavailable')).status).toBe('running');
      expect((await saga.inspect('healthy')).status).toBe('completed');
    });

    it('compensates exactly one effect under competing workers', async () => {
      participants.fulfillment.execute = async () => 'rejected';
      await saga.start('concurrent-refund', input);
      const results = await Promise.all(
        Array.from({ length: 8 }, () => saga.resume('concurrent-refund'))
      );
      expect(results.every((row) => row.status === 'cancelled')).toBe(true);
      expect(await balance('inventory')).toBe(0);
      expect(await balance('payment')).toBe(0);
    });

    it('refunds then releases; resumes a failed refund without refunding twice', async () => {
      participants.fulfillment.execute = async () => 'rejected';
      const compensate = participants.payment.compensate;
      participants.payment.compensate = async (payload, key) => {
        await compensate(payload, key);
        throw new Error('Refund response lost');
      };
      await saga.start('refund', input);
      await expect(saga.resume('refund')).rejects.toThrow(
        'Refund response lost'
      );
      expect((await saga.inspect('refund')).status).toBe('compensating');
      expect(await balance('inventory')).toBe(1);
      participants.payment.compensate = compensate;
      const restarted = new CheckoutSaga(db, participants);
      expect((await restarted.resume('refund')).status).toBe('cancelled');
      expect(await balance('payment')).toBe(0);
      expect(await balance('inventory')).toBe(0);
      await restarted.resume('refund');
      expect(await balance('payment')).toBe(0);
    });
  }
);
