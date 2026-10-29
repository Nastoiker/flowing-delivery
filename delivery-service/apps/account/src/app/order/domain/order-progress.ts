import { DomainError } from './domain-error';

export type OrderStatus = 'created' | 'confirmed' | 'delivery' | 'received';

export class OrderProgress {
  private constructor(
    readonly status: OrderStatus,
    readonly isPickUp: boolean
  ) {
    Object.freeze(this);
  }
  static restore(status: string, isPickUp: boolean): OrderProgress {
    if (!['created', 'confirmed', 'delivery', 'received'].includes(status)) {
      throw new DomainError('INVALID_STATUS', 'Неизвестный статус заказа');
    }
    return new OrderProgress(status as OrderStatus, isPickUp);
  }
  transition(target: string): OrderProgress {
    if (target === this.status) return this; // Idempotent replay.
    if (!this.allowedStatuses.includes(target as OrderStatus))
      throw new DomainError(
        'INVALID_TRANSITION',
        `Недопустимый переход ${this.status} -> ${target}`
      );
    return OrderProgress.restore(target, this.isPickUp);
  }
  get allowedStatuses(): readonly OrderStatus[] {
    const next: Partial<Record<OrderStatus, OrderStatus>> = {
      created: 'confirmed',
      confirmed: this.isPickUp ? 'received' : 'delivery',
      delivery: 'received',
    };
    return Object.freeze(
      next[this.status] ? [this.status, next[this.status]] : [this.status]
    );
  }
  get completed(): boolean {
    return this.status === 'received';
  }
}
