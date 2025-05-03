import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '@/prisma.service';
import { OrderStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('create', () => {
  it('should create an order successfully', async () => {
    const createOrderDto = {
      customer_name: 'John Doe',
      items: [
        { product_name: 'Product A', quantity: 2, price: 10 },
        { product_name: 'Product B', quantity: 1, price: 20 },
      ],
    };

    const expectedOrder = { id: 1, status: 'created' };
    const createSpy = jest.fn().mockResolvedValue(expectedOrder);
    const prismaServiceMock = {
      $transaction: jest.fn(async (callback) => {
        const mockPrisma = {
          order: {
            create: createSpy,
          },
        };
        return callback(mockPrisma);
      }),
    };

    const service = new OrdersService(prismaServiceMock as any);

    const result = await service.create(createOrderDto as any);

    expect(result).toEqual(expectedOrder);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        customerName: createOrderDto.customer_name,
        status: OrderStatus.CREATED,
        totalAmount: 40,
        orderItems: {
          createMany: {
            data: [
              {
                productName: 'Product A',
                quantity: 2,
                price: 10,
              },
              {
                productName: 'Product B',
                quantity: 1,
                price: 20,
              },
            ],
          },
        },
      },
      select: {
        id: true,
        status: true,
      },
    });
    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});
