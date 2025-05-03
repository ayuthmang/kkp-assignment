import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { toDecimalNumber } from '../../commons/dto/dto.helper';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderStatusSchema } from './update-order.dto';

export const CreateOrderBodySchema = z.object({
  customer_name: z.string(),
  items: z.array(
    z.object({
      product_name: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
});

export class CreateOrderBodyDto extends createZodDto(CreateOrderBodySchema) {}

export const CreateOrderResponseDto = z
  .object({
    id: z.number(),
    status: z.nativeEnum(OrderStatus),
  })
  .transform(({ id, status }) => ({
    order_id: id,
    status: status.toLowerCase(),
  }));
