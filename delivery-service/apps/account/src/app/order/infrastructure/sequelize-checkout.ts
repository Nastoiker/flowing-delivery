import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Food } from '../../food/models/food.model';
import { ShoppingCartRepository } from '../../shopping-cart/repositories/Shopping-cart.repositories';
import {
  CheckoutSession,
  CheckoutUnitOfWork,
} from '../application/checkout.ports';
import { Money } from '../domain/money';
import { OrderFood } from '../order-food.model';
import { Order } from '../order.model';

@Injectable()
export class SequelizeCheckout implements CheckoutUnitOfWork {
  constructor(
    private readonly db: Sequelize,
    private readonly carts: ShoppingCartRepository,
    @InjectModel(Order) private readonly orders: typeof Order,
    @InjectModel(OrderFood) private readonly lines: typeof OrderFood,
    @InjectModel(Food) private readonly foods: typeof Food
  ) {}

  run<T>(work: (session: CheckoutSession) => Promise<T>): Promise<T> {
    return this.db.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (transaction) => {
        const locked = new Map<number, Food>();
        return work({
          lockCart: async (userId) =>
            (await this.carts.getForCheckout(userId, transaction)).map(
              (item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.count,
              })
            ),
          lockCatalog: async (ids) => {
            // Lock in the same order across all checkouts, including reversed carts.
            for (const id of [...new Set(ids)].sort((a, b) => a - b)) {
              const row = await this.foods.findByPk(id, {
                transaction,
                lock: transaction.LOCK.UPDATE,
              });
              if (row) locked.set(id, row);
            }
            return [...locked.values()].map((row) => ({
              id: row.id,
              title: row.title,
              unitPrice: Money.fromMajor(row.price),
              count: row.count,
              available: row.in_stock,
            }));
          },
          save: async (order) => {
            const row = await this.orders.create(
              {
                userId: order.details.userId,
                deliveryAddress: order.details.deliveryAddress,
                isPickUp: order.details.isPickUp,
                status: 'created',
                completed: false,
                isPaid: false,
                deliveryPrice: order.details.deliveryFee.toMajor(),
                priceFood: order.foodTotal.toMajor(),
                totalPrice: order.total.toMajor(),
              },
              { transaction }
            );
            for (const line of order.lines) {
              const food = locked.get(line.productId);
              if (!food)
                throw new Error(
                  'Checkout adapter requires a locked catalog row'
                );
              await food.update(
                {
                  count: food.count - line.quantity,
                  in_stock: food.in_stock - line.quantity,
                },
                { transaction }
              );
              await this.lines.create(
                {
                  orderId: row.id,
                  foodId: line.productId,
                  quantity: line.quantity,
                  productTitle: line.title,
                  unitPriceMinor: String(line.unitPrice.minor),
                },
                { transaction }
              );
            }
            return {
              id: row.id,
              userId: row.userId,
              status: row.status,
              deliveryAddress: row.deliveryAddress,
              isPickUp: row.isPickUp,
              deliveryPrice: row.deliveryPrice,
              priceFood: row.priceFood,
              totalPrice: row.totalPrice,
              completed: row.completed,
              isPaid: row.isPaid,
            };
          },
          removeCartItems: (userId, ids) =>
            this.carts.removeCheckedOut(userId, [...ids], transaction),
        });
      }
    );
  }
}
