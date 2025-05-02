import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

// A helper function that converts Decimal.js objects (or strings) to numbers.
const toDecimalNumber = (value: unknown) => {
  if (value instanceof Decimal) return value.toNumber();
  if (typeof value === 'string') return parseFloat(value);
  return value;
};

export const OrderItemResponseSchema = z
  .object({
    productName: z.string(),
    quantity: z.number(),
    price: z.preprocess(toDecimalNumber, z.number()),
  })
  .transform(({ productName, quantity, price }) => ({
    product_name: productName,
    quantity,
    price,
  }));

export const OrderResponseSchema = z
  .object({
    id: z.number(),
    customerName: z.string(),
    totalAmount: z.preprocess(toDecimalNumber, z.number()),
    orderItems: z.array(OrderItemResponseSchema),
  })
  .transform(({ id, customerName, totalAmount, orderItems }) => ({
    order_id: id,
    customer_name: customerName,
    total_amount: totalAmount,
    items: orderItems,
  }));
