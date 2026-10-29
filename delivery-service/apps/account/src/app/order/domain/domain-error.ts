export class DomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export function positiveInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new DomainError(
      'INVALID_QUANTITY',
      `${field}: должно быть положительным целым числом`
    );
  }
}
