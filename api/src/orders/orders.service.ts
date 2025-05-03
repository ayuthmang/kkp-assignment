import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderBodyDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '@/prisma.service';
import { statusMap, sumOrderItems } from './orders.helper';
import { OrderStatus } from '@prisma/client';
import { PaginationQueryDto } from '@/commons/dto/pagination.dto';
import { getPaginationParams } from '@/commons/dto/pagination.helper';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderDto: CreateOrderBodyDto) {
    return this.prismaService.$transaction(async (prisma) => {
      const orderItems = createOrderDto.items.map((item) => ({
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }));
      const totalAmount = sumOrderItems(orderItems);

      const order = await prisma.order.create({
        data: {
          customerName: createOrderDto.customer_name,
          status: statusMap[OrderStatus.CREATED],
          totalAmount,
          orderItems: {
            createMany: {
              data: orderItems,
            },
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      return order;
    });
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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: id,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    const mappedStatus = statusMap[updateOrderDto.status.toLowerCase()];
    if (!mappedStatus) {
      throw new Error(`Invalid status: ${updateOrderDto.status}`);
    }

    const updatedOrder = await this.prismaService.order.update({
      where: { id },
      data: { status: mappedStatus },
      select: {
        id: true,
        status: true,
      },
    });

    return updatedOrder;
  }
}
