import { IFood, IOrder } from '@delivery-service/interfaces';
import { Money } from '../domain/money';
import { Order } from '../order.model';
import { OrderProgress } from '../domain/order-progress';

interface PurchaseProduct extends IFood {
  OrderFood?: {
    quantity: number;
    productTitle?: string | null;
    unitPriceMinor?: string | null;
  };
}
interface OrderView extends Omit<IOrder, 'products'> {
  products?: PurchaseProduct[];
  isPickUp: boolean;
}

/** Compatibility read model: existing UI sees purchase prices, not today's catalog. */
export function orderView(order: Order): OrderView {
  const data = order.toJSON() as OrderView;
  return {
    ...data,
    allowedStatuses: [
      ...OrderProgress.restore(data.status, data.isPickUp).allowedStatuses,
    ],
    products: data.products?.map((product) => {
      const snapshot = product.OrderFood;
      return {
        ...product,
        title: snapshot?.productTitle ?? product.title,
        price:
          snapshot?.unitPriceMinor != null
            ? Money.fromMinor(Number(snapshot.unitPriceMinor)).toMajor()
            : product.price,
      };
    }),
  };
}
