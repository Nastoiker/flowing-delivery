import { DomainError, positiveInteger } from './domain-error';
import { Money } from './money';

export interface CartItem {
  readonly id: number;
  readonly productId: number;
  readonly quantity: number;
}
export interface CatalogItem {
  readonly id: number;
  readonly title: string;
  readonly unitPrice: Money;
  readonly count: number;
  readonly available: number;
}
export interface OrderLine {
  readonly productId: number;
  readonly title: string;
  readonly quantity: number;
  readonly unitPrice: Money;
}
export interface CheckoutDetails {
  readonly userId: number;
  readonly deliveryAddress: string;
  readonly isPickUp: boolean;
  readonly deliveryFee: Money;
}

/** Order owns the price/title snapshots. Catalog and customer remain separate aggregates. */
export class CheckoutOrder {
  readonly lines: readonly OrderLine[];
  readonly foodTotal: Money;
  readonly total: Money;
  readonly details: Readonly<CheckoutDetails>;

  private constructor(details: CheckoutDetails, lines: OrderLine[]) {
    this.details = Object.freeze({ ...details });
    this.lines = Object.freeze(lines.map((line) => Object.freeze({ ...line })));
    this.foodTotal = lines.reduce(
      (sum, line) => sum.add(line.unitPrice.multiply(line.quantity)),
      Money.fromMinor(0)
    );
    this.total = this.foodTotal.add(details.deliveryFee);
    Object.freeze(this);
  }

  static place(
    details: CheckoutDetails,
    cart: readonly CartItem[],
    catalog: readonly CatalogItem[]
  ): CheckoutOrder {
    positiveInteger(details.userId, 'Пользователь');
    if (typeof details.isPickUp !== 'boolean')
      throw new DomainError(
        'INVALID_DELIVERY',
        'Некорректный способ получения'
      );
    if (!details.isPickUp && !details.deliveryAddress?.trim())
      throw new DomainError('INVALID_ADDRESS', 'Не указан адрес доставки');
    if (!cart.length) throw new DomainError('EMPTY_CART', 'Корзина пуста');
    const quantities = new Map<number, number>();
    for (const item of cart) {
      positiveInteger(item.productId, 'Товар');
      positiveInteger(item.quantity, 'Количество товара');
      const quantity = (quantities.get(item.productId) || 0) + item.quantity;
      positiveInteger(quantity, 'Количество товара');
      quantities.set(item.productId, quantity);
    }
    const byId = new Map(catalog.map((item) => [item.id, item]));
    const lines = [...quantities]
      .sort(([a], [b]) => a - b)
      .map(([productId, quantity]) => {
        const product = byId.get(productId);
        if (!product)
          throw new DomainError(
            'PRODUCT_NOT_FOUND',
            'Товар больше не существует'
          );
        if (
          !Number.isSafeInteger(product.count) ||
          product.count < 0 ||
          !Number.isSafeInteger(product.available) ||
          product.available < 0
        ) {
          throw new DomainError('INVALID_STOCK', 'Некорректный остаток товара');
        }
        if (quantity > product.count || quantity > product.available) {
          throw new DomainError(
            'OUT_OF_STOCK',
            'Недостаточно товара для оформления заказа'
          );
        }
        if (!product.title?.trim())
          throw new DomainError(
            'INVALID_PRODUCT',
            'Не указано название товара'
          );
        return {
          productId,
          quantity,
          title: product.title,
          unitPrice: product.unitPrice,
        };
      });
    return new CheckoutOrder(details, lines);
  }
}
