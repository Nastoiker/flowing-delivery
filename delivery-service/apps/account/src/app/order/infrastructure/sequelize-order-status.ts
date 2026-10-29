import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  OrderStatusSession,
  OrderStatusStore,
} from '../application/change-order-status';
import { DomainError } from '../domain/domain-error';
import { OrderProgress } from '../domain/order-progress';
import { Order } from '../order.model';

@Injectable()
export class SequelizeOrderStatus implements OrderStatusStore {
  constructor(@InjectModel(Order) private readonly orders: typeof Order) {}

  withLockedOrder<T>(
    id: number,
    work: (session: OrderStatusSession) => Promise<T>
  ): Promise<T> {
    return this.orders.sequelize.transaction(async (transaction) => {
      const row = await this.orders.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!row) throw new DomainError('ORDER_NOT_FOUND', 'Заказ не найден');
      return work({
        userId: row.userId,
        progress: OrderProgress.restore(row.status, row.isPickUp),
        save: async (progress) => {
          await row.update(
            { status: progress.status, completed: progress.completed },
            { transaction }
          );
        },
      });
    });
  }
}
