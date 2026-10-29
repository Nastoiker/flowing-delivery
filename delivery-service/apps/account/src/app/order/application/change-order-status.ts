import { DomainError, positiveInteger } from '../domain/domain-error';
import { OrderProgress } from '../domain/order-progress';

export interface OrderStatusSession {
  readonly userId: number;
  readonly progress: OrderProgress;
  save(progress: OrderProgress): Promise<void>;
}
export interface OrderStatusStore {
  withLockedOrder<T>(
    id: number,
    work: (session: OrderStatusSession) => Promise<T>
  ): Promise<T>;
}

export class ChangeOrderStatus {
  constructor(private readonly store: OrderStatusStore) {}

  async execute(command: {
    id?: number;
    status?: string;
  }): Promise<{ userId: number }> {
    positiveInteger(command.id, 'Заказ');
    if (
      typeof command.status !== 'string' ||
      Object.keys(command).some((key) => !['id', 'status'].includes(key))
    ) {
      throw new DomainError(
        'INVALID_COMMAND',
        'Обновление заказа принимает только id и status'
      );
    }
    return this.store.withLockedOrder(command.id, async (session) => {
      await session.save(session.progress.transition(command.status));
      return { userId: session.userId };
    });
  }
}
