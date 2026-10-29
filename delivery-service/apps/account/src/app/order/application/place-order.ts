import { CheckoutOrder } from '../domain/checkout-order';
import { positiveInteger } from '../domain/domain-error';
import { Money } from '../domain/money';
import { CheckoutUnitOfWork, PlacedOrder } from './checkout.ports';

/** Transport independent input. Legacy HTTP prices/status/payment flags are not accepted. */
export interface PlaceOrderCommand {
  userId: number;
  deliveryAddress: string;
  isPickUp: boolean;
  deliveryFee: Money;
}

export class PlaceOrder {
  constructor(private readonly unitOfWork: CheckoutUnitOfWork) {}

  async execute(command: PlaceOrderCommand): Promise<PlacedOrder> {
    positiveInteger(command.userId, 'Пользователь');
    return this.unitOfWork.run(async (session) => {
      const cart = await session.lockCart(command.userId);
      const catalog = await session.lockCatalog(
        [...new Set(cart.map((item) => item.productId))].sort((a, b) => a - b)
      );
      const order = CheckoutOrder.place(command, cart, catalog);
      const saved = await session.save(order);
      await session.removeCartItems(
        command.userId,
        cart.map((item) => item.id)
      );
      return saved;
    });
  }
}
