import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderDto,
  UpdateOrderParamDto,
  UpdateOrderResponseDto,
} from './dto/update-order.dto';
import { OrderResponseSchema } from './dto/response.dto';
import { UseZodGuard, ZodSerializerDto } from 'nestjs-zod';
import { PaginationQueryDto } from './dto/get-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
