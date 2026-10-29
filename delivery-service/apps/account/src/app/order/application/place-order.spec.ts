import { PlaceOrder } from './place-order';
import { CheckoutSession, CheckoutUnitOfWork } from './checkout.ports';
import { Money } from '../domain/money';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('PlaceOrder application boundary', () => {
  const command = {
    userId: 7,
    deliveryAddress: 'Address',
    isPickUp: false,
    deliveryFee: Money.fromMinor(100),
  };
  function harness() {
    const session: jest.Mocked<CheckoutSession> = {
      lockCart: jest
        .fn()
        .mockResolvedValue([{ id: 22, productId: 5, quantity: 1 }]),
      lockCatalog: jest.fn().mockResolvedValue([
        {
          id: 5,
          title: 'Meal',
          unitPrice: Money.fromMajor(20),
          count: 1,
          available: 1,
        },
      ]),
      save: jest.fn().mockResolvedValue({ id: 10 }),
      removeCartItems: jest.fn().mockResolvedValue(undefined),
    };
    const unitOfWork: CheckoutUnitOfWork = { run: (work) => work(session) };
    return { session, useCase: new PlaceOrder(unitOfWork) };
  }
  it('persists a validated aggregate and clears only the captured cart ids', async () => {
    const { session, useCase } = harness();
    expect(await useCase.execute(command)).toEqual({ id: 10 });
    expect(session.save.mock.calls[0][0].total.minor).toBe(2100);
    expect(session.removeCartItems).toHaveBeenCalledWith(7, [22]);
  });
  it('never clears cart after failed persistence', async () => {
    const { session, useCase } = harness();
    session.save.mockRejectedValue(new Error('database failed'));
    await expect(useCase.execute(command)).rejects.toThrow('database failed');
    expect(session.removeCartItems).not.toHaveBeenCalled();
  });
  it('rejects invalid checkout before persistence', async () => {
    const { session, useCase } = harness();
    session.lockCart.mockResolvedValue([]);
    await expect(useCase.execute(command)).rejects.toThrow('Корзина пуста');
    expect(session.save).not.toHaveBeenCalled();
  });
  it('keeps domain and application free from frameworks, ORM and transport contracts', () => {
    for (const directory of [__dirname, join(__dirname, '../domain')]) {
      for (const file of readdirSync(directory).filter(
        (name) => name.endsWith('.ts') && !name.endsWith('.spec.ts')
      )) {
        const source = readFileSync(join(directory, file), 'utf8');
        expect(source).not.toMatch(
          /from\s+['"](?:@nestjs|sequelize|@delivery-service|.*infrastructure|.*\.model)/
        );
      }
    }
  });
});
