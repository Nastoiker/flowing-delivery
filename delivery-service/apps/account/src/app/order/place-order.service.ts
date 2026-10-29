import { OrderCreate } from '@delivery-service/contracts';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ShoppingCartRepository } from '../shopping-cart/repositories/Shopping-cart.repositories';
import { OrderRepository } from './order.repository';

@Injectable()
export class PlaceOrderService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly orders: OrderRepository,
    private readonly carts: ShoppingCartRepository
  ) {}

  async execute(dto: OrderCreate.Request): Promise<OrderCreate.Response> {
    if (!Number.isSafeInteger(dto.userId) || dto.userId <= 0) {
      throw new Error('Некорректный пользователь заказа');
    }
    // Тариф доставки пока приходит из прежнего контракта. Проверка числа не
    // защищает от подмены тарифа: следующим этапом нужен серверный расчёт доставки.
    const deliveryPrice = dto.deliveryPrice ?? 0;
    if (
      !Number.isFinite(deliveryPrice) ||
      deliveryPrice < 0 ||
      !Number.isSafeInteger(Math.round(deliveryPrice * 100))
    ) {
      throw new Error('Некорректная стоимость доставки');
    }
    const deliveryMinor = Math.round(deliveryPrice * 100);

    // Управляемая транзакция: возврат из callback ведёт к COMMIT, исключение —
    // к ROLLBACK. Не перехватываем ошибку внутри callback с возвратом «успеха».
    return this.sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (transaction) => {
        // Блокируем только строки корзины, без JOIN: два оформления одной
        // корзины не должны одновременно использовать одни и те же позиции.
        const items = await this.carts.getForCheckout(dto.userId, transaction);
        if (!items.length) throw new Error('Корзина пуста');

        // Явный список полей исключает передачу isPaid/completed/id через body.
        // Промежуточные нулевые суммы не видны другим транзакциям до COMMIT.
        const order = await this.orders.createOrder(
          {
            userId: dto.userId,
            status: 'created',
            deliveryAddress: dto.deliveryAddress,
            isPickUp: dto.isPickUp ?? false,
            deliveryPrice: deliveryMinor / 100,
            priceFood: 0,
            totalPrice: 0,
            completed: false,
            isPaid: false,
          },
          transaction
        );
        const foodMinor = await this.orders.createFoodForOrder(
          items,
          order.id,
          transaction
        );
        const totalMinor = foodMinor + deliveryMinor;
        if (!Number.isSafeInteger(totalMinor)) {
          throw new Error('Сумма заказа слишком велика');
        }
        await this.orders.setTotals(
          order,
          foodMinor / 100,
          totalMinor / 100,
          transaction
        );
        // Удаляем только оформленные ID. Новую позицию, добавленную параллельно,
        // нельзя стереть широким DELETE WHERE userId.
        await this.carts.removeCheckedOut(
          dto.userId,
          items.map((item) => item.id),
          transaction
        );
        return { order };
      }
    );
  }
}
