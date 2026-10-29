import { QueryTypes, Sequelize } from 'sequelize';

export interface CheckoutInput {
  orderId: number;
  amountMinor: number;
  currency: 'RUB';
}

/** Participants MUST persist the key, result and business mutation atomically.
 * A rejection means definitely no effect. Timeouts must throw, never reject.
 * Keys must survive compensation: a late duplicate must return the old result.
 */
export interface CheckoutParticipant {
  execute(input: CheckoutInput, key: string): Promise<'accepted' | 'rejected'>;
  compensate(input: CheckoutInput, key: string): Promise<void>;
}

interface SagaRow {
  id: string;
  input: CheckoutInput;
  status: 'running' | 'compensating' | 'completed' | 'cancelled';
  step: number;
  version: number;
}

/** Durable orchestration; no external calls inside a database transaction.
 * A worker can resume any nonterminal id after restart. All effects use stable
 * idempotency keys, including the crash window before saving a transition.
 * Versioned workflow: never reorder steps for existing v1 instances.
 */
export class CheckoutSaga {
  private readonly steps: readonly CheckoutParticipant[];

  constructor(
    private readonly db: Sequelize,
    participants: {
      inventory: CheckoutParticipant;
      payment: CheckoutParticipant;
      fulfillment: CheckoutParticipant;
    }
  ) {
    this.steps = [
      participants.inventory,
      participants.payment,
      participants.fulfillment,
    ];
  }

  async start(id: string, input: CheckoutInput): Promise<void> {
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error('Invalid saga id');
    if (
      !Number.isSafeInteger(input.orderId) ||
      input.orderId <= 0 ||
      !Number.isSafeInteger(input.amountMinor) ||
      input.amountMinor <= 0 ||
      input.currency !== 'RUB'
    )
      throw new Error('Invalid checkout input');
    const payload = JSON.stringify({
      orderId: input.orderId,
      amountMinor: input.amountMinor,
      currency: input.currency,
    });
    await this.db.query(
      `INSERT INTO checkout_sagas (id, input) VALUES ($1, $2::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      { bind: [id, payload] }
    );
    const rows = await this.db.query<{ matches: boolean }>(
      'SELECT input = $2::jsonb AS matches FROM checkout_sagas WHERE id = $1',
      { bind: [id, payload], type: QueryTypes.SELECT }
    );
    if (!rows[0]?.matches)
      throw new Error('Idempotency key reused with different input');
  }

  async inspect(id: string): Promise<SagaRow> {
    const rows = await this.db.query<SagaRow>(
      'SELECT id, input, status, step, version FROM checkout_sagas WHERE id = $1',
      { bind: [id], type: QueryTypes.SELECT }
    );
    if (!rows[0]) throw new Error('Saga not found');
    return rows[0];
  }

  async resume(id: string): Promise<SagaRow> {
    for (;;) {
      const current = await this.inspect(id);
      if (current.status === 'completed' || current.status === 'cancelled')
        return current;
      const next = { ...current };
      const key = `checkout:v1:${id}:${current.step}`;
      if (current.status === 'running') {
        const result = await this.steps[current.step].execute(
          current.input,
          key
        );
        if (result === 'accepted') {
          if (current.step === this.steps.length - 1) next.status = 'completed';
          else next.step++;
        } else if (result === 'rejected') {
          next.step--;
          next.status = next.step < 0 ? 'cancelled' : 'compensating';
        } else {
          throw new Error('Invalid participant result');
        }
      } else {
        await this.steps[current.step].compensate(
          current.input,
          `${key}:compensate`
        );
        next.step--;
        if (next.step < 0) next.status = 'cancelled';
      }
      await this.db.transaction(async (transaction) => {
        const updated = await this.db.query<{ version: number }>(
          `UPDATE checkout_sagas SET status = $3, step = $4,
             version = version + 1, updated_at = now()
           WHERE id = $1 AND version = $2 RETURNING version`,
          {
            bind: [id, current.version, next.status, next.step],
            transaction,
            type: QueryTypes.SELECT,
          }
        );
        if (updated.length) {
          await this.db.query(
            `INSERT INTO checkout_saga_events (saga_id, version, status, step)
             VALUES ($1, $2, $3, $4)`,
            {
              bind: [id, updated[0].version, next.status, next.step],
              transaction,
            }
          );
        }
      });
    }
  }

  /** Bounded recovery batch. Failed instances stay pending for a later retry.
   * Scheduling/backoff and alerting belong to the worker hosting this engine.
   */
  async recover(limit = 100): Promise<PromiseSettledResult<SagaRow>[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000)
      throw new Error('Invalid batch size');
    const rows = await this.db.query<{ id: string }>(
      `SELECT id FROM checkout_sagas WHERE status IN ('running', 'compensating')
       ORDER BY updated_at, id LIMIT $1`,
      { bind: [limit], type: QueryTypes.SELECT }
    );
    // Sequential execution bounds load on the payment provider.
    const results: PromiseSettledResult<SagaRow>[] = [];
    for (const row of rows) {
      try {
        results.push({ status: 'fulfilled', value: await this.resume(row.id) });
      } catch (reason) {
        results.push({ status: 'rejected', reason });
      }
    }
    return results;
  }
}
