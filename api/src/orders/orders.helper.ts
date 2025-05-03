import { OrderStatus } from '@prisma/client';

export const statusMap: Record<string, OrderStatus> = {
  created: OrderStatus.CREATED,
  completed: OrderStatus.COMPLETED,
};
