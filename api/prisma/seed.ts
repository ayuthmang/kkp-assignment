/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function createOrder() {
  return {
    customerName: faker.person.fullName(),
  };
}

export function createOrderItem() {
  return {
    productName: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 3 }),
    price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
  };
}

async function seed() {
  console.log('🌱 Seeding...');
  console.time(`🌱 Database has been seeded`);

  console.time('🧹 Cleaned up the database...');
  await prisma.order.deleteMany();
  console.timeEnd('🧹 Cleaned up the database...');

  const totalOrders = 2;
  console.time(`👤 Created ${totalOrders} orders...`);

  for (let index = 0; index < totalOrders; index++) {
    const orderItems = Array.from({
      length: faker.number.int({ min: 1, max: 3 }),
    }).map(() => {
      return {
        ...createOrderItem(),
      };
    });

    const totalOrderAmount = orderItems.reduce((acc, val) => {
      return acc + parseFloat((val.price * val.quantity).toFixed(2));
    }, 0.0);

    await prisma.order
      .create({
        select: { id: true },
        data: {
          ...createOrder(),
          orderItems: { create: orderItems },
          totalAmount: totalOrderAmount,
        },
      })
      .catch((e) => {
        console.error('Error creating a orders:', e);
        return null;
      });
  }
  console.timeEnd(`👤 Created ${totalOrders} orders...`);

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
