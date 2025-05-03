import { Decimal } from '@prisma/client/runtime/library';

// A helper function that converts Decimal.js objects (or strings) to numbers.
export const toDecimalNumber = (value: unknown) => {
  if (value instanceof Decimal) return value.toNumber();
  if (typeof value === 'string') return parseFloat(value);
  return value;
};
