import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreateOrderBodyDto,
  CreateOrderResponseDto,
} from './dto/create-order.dto';
import {
  UpdateOrderDto,
  UpdateOrderParamDto,
  UpdateOrderResponseDto,
} from './dto/update-order.dto';
import { OrderResponseSchema } from './dto/get-order.dto';
import { UseZodGuard, ZodSerializerDto } from 'nestjs-zod';

import { PaginationQueryDto } from '../commons/dto/pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseZodGuard('body', CreateOrderBodyDto)
  @ZodSerializerDto(CreateOrderResponseDto)
  create(@Body() createOrderDto: CreateOrderBodyDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ZodSerializerDto(OrderResponseSchema)
  @UseZodGuard('query', PaginationQueryDto)
  async findAll(@Query() queryParams: PaginationQueryDto) {
    const orders = await this.ordersService.findAll(queryParams);
    return orders;
  }

  @Get(':id')
  @ZodSerializerDto(OrderResponseSchema)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put('/:id/status')
  @UseZodGuard('params', UpdateOrderParamDto)
  @UseZodGuard('body', UpdateOrderDto)
  @ZodSerializerDto(UpdateOrderResponseDto)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
