import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(10),
});

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
