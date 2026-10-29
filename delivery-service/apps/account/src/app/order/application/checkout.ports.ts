import { CartItem, CatalogItem, CheckoutOrder } from '../domain/checkout-order';

export interface PlacedOrder {
  id: number;
  userId: number;
  status: string;
  deliveryAddress: string;
  isPickUp: boolean;
  deliveryPrice: number;
  priceFood: number;
  totalPrice: number;
  completed: boolean;
  isPaid: boolean;
}
/** All methods belong to one local transaction; adapters must hold locks until commit. */
export interface CheckoutSession {
  lockCart(userId: number): Promise<readonly CartItem[]>;
  lockCatalog(productIds: readonly number[]): Promise<readonly CatalogItem[]>;
  save(order: CheckoutOrder): Promise<PlacedOrder>;
  removeCartItems(userId: number, ids: readonly number[]): Promise<void>;
}
export interface CheckoutUnitOfWork {
  run<T>(work: (session: CheckoutSession) => Promise<T>): Promise<T>;
}
export const CHECKOUT_UNIT_OF_WORK = Symbol('CHECKOUT_UNIT_OF_WORK');
