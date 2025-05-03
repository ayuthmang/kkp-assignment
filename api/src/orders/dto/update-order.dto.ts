import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { OrderStatus } from '@prisma/client';

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['created', 'completed']),
});

export const UpdateOrderStatusParamSchema = z.object({
  id: z.coerce.number(),
});

export const UpdateOrderStatusResponseSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(OrderStatus).transform((status) => status.toLowerCase()),
});

export class UpdateOrderDto extends createZodDto(UpdateOrderStatusSchema) {}

export class UpdateOrderParamDto extends createZodDto(
  UpdateOrderStatusParamSchema,
) {}
export class UpdateOrderResponseDto extends createZodDto(
  UpdateOrderStatusResponseSchema,
) {}
