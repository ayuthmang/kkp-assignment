import { z } from 'zod';
import { toDecimalNumber } from '../../commons/dto/dto.helper';

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
