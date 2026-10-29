import { OrderCreate } from '@delivery-service/contracts';
import { Inject, Injectable } from '@nestjs/common';
import {
  CHECKOUT_UNIT_OF_WORK,
  CheckoutUnitOfWork,
} from './application/checkout.ports';
import { PlaceOrder } from './application/place-order';
import { Money } from './domain/money';

/** Legacy RMQ contract adapter. Application/domain code never imports transport DTOs. */
@Injectable()
export class PlaceOrderService {
  private readonly useCase: PlaceOrder;
  constructor(@Inject(CHECKOUT_UNIT_OF_WORK) unitOfWork: CheckoutUnitOfWork) {
    this.useCase = new PlaceOrder(unitOfWork);
  }

  async execute(dto: OrderCreate.Request): Promise<OrderCreate.Response> {
    // Existing contract supplies the delivery tariff. This is NOT a trusted quote;
    // server-side delivery pricing is a separate integration, not a domain default.
    const order = await this.useCase.execute({
      userId: dto.userId,
      deliveryAddress: dto.deliveryAddress ?? '',
      isPickUp: dto.isPickUp ?? false,
      deliveryFee: Money.fromMajor(dto.deliveryPrice ?? 0),
    });
    return { order };
  }
}
