import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('create', () => {
  it('should create an order successfully', async () => {
    const dummyDto = {
      customer_name: 'John Doe',
      items: [
        { product_name: 'Product A', quantity: 2, price: 10 },
        { product_name: 'Product B', quantity: 1, price: 20 },
      ],
    };

    // Expected totalAmount: 2*10 + 1*20 = 40
    const expectedOrder = { id: 1, status: 'created' };

    // Create a spy for the prisma.order.create method inside the transaction's callback.
    const createSpy = jest.fn().mockResolvedValue(expectedOrder);

    // Mock prismaService with $transaction that calls the provided callback with a mocked prisma object.
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

    const result = await service.create(dummyDto as any);

    expect(result).toEqual(expectedOrder);

    // Verify that the prisma.order.create method was called with expected arguments.
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        customerName: dummyDto.customer_name,
        status: expect.any(String),
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
  });
});
