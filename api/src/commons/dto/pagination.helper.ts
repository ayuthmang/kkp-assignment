import { PaginationQueryDto } from './pagination.dto';

export function getPaginationParams({ page = 1, size }: PaginationQueryDto) {
  const validatedPage = page < 1 ? 1 : page;
  const skip = (validatedPage - 1) * size;
  return {
    skip,
    take: size,
  };
}
