import { OrderStatus } from '@prisma/client';

export const statusMap: Record<string, OrderStatus> = {
  created: OrderStatus.CREATED,
  completed: OrderStatus.COMPLETED,
};

export function sumOrderItems(
  orderItems: { price: number; quantity: number }[],
) {
  return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}
