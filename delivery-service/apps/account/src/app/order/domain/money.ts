import { DomainError, positiveInteger } from './domain-error';

/** RUB only. Immutable, exact minor units; no silent rounding at the boundary. */
export class Money {
  private constructor(public readonly minor: number) {
    Object.freeze(this);
  }

  static fromMinor(minor: number): Money {
    if (!Number.isSafeInteger(minor) || minor < 0) {
      throw new DomainError(
        'INVALID_MONEY',
        'Некорректная сумма или переполнение'
      );
    }
    return new Money(minor);
  }

  static fromMajor(value: number | string): Money {
    const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(String(value));
    if (!match)
      throw new DomainError(
        'INVALID_MONEY',
        'Цена должна содержать не более двух знаков после запятой'
      );
    const minor =
      BigInt(match[1]) * BigInt(100) + BigInt((match[2] || '').padEnd(2, '0'));
    if (minor > BigInt(Number.MAX_SAFE_INTEGER))
      throw new DomainError('INVALID_MONEY', 'Сумма слишком велика');
    return Money.fromMinor(Number(minor));
  }

  add(other: Money): Money {
    return Money.fromMinor(this.minor + other.minor);
  }
  multiply(quantity: number): Money {
    positiveInteger(quantity, 'Количество товара');
    return Money.fromMinor(this.minor * quantity);
  }
  toMajor(): number {
    const major = this.minor / 100;
    if (Money.fromMajor(major).minor !== this.minor) {
      throw new DomainError(
        'INVALID_MONEY',
        'Сумма теряет точность в числовом контракте'
      );
    }
    return major;
  }
}
