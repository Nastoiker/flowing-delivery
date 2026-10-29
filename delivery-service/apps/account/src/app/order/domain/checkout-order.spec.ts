import { CheckoutOrder } from './checkout-order';
import { DomainError } from './domain-error';
import { Money } from './money';
import { OrderProgress } from './order-progress';

const details = () => ({
  userId: 1,
  deliveryAddress: 'Test address',
  isPickUp: false,
  deliveryFee: Money.fromMajor(10),
});
const item = (quantity = 2) => ({ id: 1, productId: 1, quantity });
const product = () => ({
  id: 1,
  title: 'Original',
  unitPrice: Money.fromMajor('0.29'),
  count: 10,
  available: 10,
});

describe('Money', () => {
  it('adds decimal prices exactly without floating point rounding', () => {
    expect(Money.fromMajor('0.10').add(Money.fromMajor('0.20')).minor).toBe(30);
    expect(Money.fromMajor(0.29).multiply(3).minor).toBe(87);
  });
  it.each([
    -1,
    NaN,
    Infinity,
    0.001,
    1.999,
    null,
    undefined,
    '1e2',
    '',
    '1.001',
  ])('rejects invalid monetary value %s', (value) => {
    expect(() => Money.fromMajor(value as number)).toThrow(DomainError);
  });
  it('rejects overflow in parsing, addition and multiplication', () => {
    expect(() => Money.fromMajor('90071992547409.92')).toThrow();
    expect(() =>
      Money.fromMinor(Number.MAX_SAFE_INTEGER).add(Money.fromMinor(1))
    ).toThrow();
    expect(() =>
      Money.fromMinor(Number.MAX_SAFE_INTEGER).multiply(2)
    ).toThrow();
  });
  it('does not silently lose a cent when converting to the legacy numeric contract', () => {
    expect(() => Money.fromMinor(Number.MAX_SAFE_INTEGER).toMajor()).toThrow(
      'точность'
    );
  });
});

describe('CheckoutOrder', () => {
  it('merges duplicate cart products and owns immutable price/title snapshots', () => {
    const source = product();
    const order = CheckoutOrder.place(
      details(),
      [item(), { ...item(1), id: 2 }],
      [source]
    );
    source.title = 'Changed';
    source.unitPrice = Money.fromMajor(500);
    expect(order.lines).toHaveLength(1);
    expect(order.lines[0].quantity).toBe(3);
    expect(order.lines[0].title).toBe('Original');
    expect(order.foodTotal.minor).toBe(87);
    expect(order.total.minor).toBe(1087);
    expect(Object.isFrozen(order.lines[0])).toBe(true);
    expect(Object.isFrozen(order.details)).toBe(true);
  });
  it('validates aggregate stock demand across duplicate rows', () => {
    expect(() =>
      CheckoutOrder.place(details(), [item(6), item(5)], [product()])
    ).toThrow('Недостаточно');
  });
  it.each([0, -1, 0.5, NaN, Number.MAX_SAFE_INTEGER + 1])(
    'rejects quantity %s',
    (quantity) => {
      expect(() =>
        CheckoutOrder.place(details(), [item(quantity)], [product()])
      ).toThrow();
    }
  );
  it('rejects an empty cart, missing catalog item and invalid stock', () => {
    expect(() => CheckoutOrder.place(details(), [], [])).toThrow(
      'Корзина пуста'
    );
    expect(() => CheckoutOrder.place(details(), [item()], [])).toThrow(
      'Товар больше'
    );
    expect(() =>
      CheckoutOrder.place(
        details(),
        [item()],
        [{ ...product(), available: null }]
      )
    ).toThrow('Некорректный остаток');
  });
  it('requires delivery address only for delivery orders', () => {
    expect(() =>
      CheckoutOrder.place(
        { ...details(), deliveryAddress: '  ' },
        [item()],
        [product()]
      )
    ).toThrow('адрес');
    expect(
      CheckoutOrder.place(
        { ...details(), deliveryAddress: '', isPickUp: true },
        [item()],
        [product()]
      )
    ).toBeDefined();
  });
});

describe('OrderProgress', () => {
  it('follows delivery stages and derives completion', () => {
    const created = OrderProgress.restore('created', false);
    expect(created.transition('created')).toBe(created);
    const received = created
      .transition('confirmed')
      .transition('delivery')
      .transition('received');
    expect(received.completed).toBe(true);
    expect(created.completed).toBe(false);
    expect(() => received.transition('created')).toThrow();
    expect(() => created.transition('received')).toThrow();
  });
  it('pickup goes from confirmed to received without a courier stage', () => {
    const confirmed = OrderProgress.restore('confirmed', true);
    expect(confirmed.transition('received').completed).toBe(true);
    expect(() => confirmed.transition('delivery')).toThrow();
  });
  it('rejects unknown persisted and requested states', () => {
    expect(() => OrderProgress.restore('unknown', false)).toThrow();
    expect(() =>
      OrderProgress.restore('created', false).transition('paid')
    ).toThrow();
  });
});
