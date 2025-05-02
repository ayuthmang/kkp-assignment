import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationQueryDto } from './dto/get-query.dto';

export function getPaginationParams({ page = 1, size }: PaginationQueryDto) {
  const validatedPage = page < 1 ? 1 : page;
  const skip = (validatedPage - 1) * size;
  return {
    skip,
    take: size,
  };
}

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }
  async findAll(queryParams: PaginationQueryDto) {
    const { skip, take } = getPaginationParams(queryParams);

    const orders = await this.prismaService.order.findMany({
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        orderItems: {
          select: {
            productName: true,
            quantity: true,
            price: true,
          },
        },
      },
      skip,
      take,
    });
    return orders;
  }

  async findOne(id: number) {
    const order = await this.prismaService.order.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        orderItems: true,
      },
    });
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
