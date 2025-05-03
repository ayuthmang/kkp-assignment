import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  registerGlobals(app);
  await app.listen(process.env.PORT ?? 3000);
}

export async function registerGlobals(app: INestApplication) {
  /**
   * Swagger
   */
  // nestks-zod: patch before setup the swagger
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('Order Management System API')
    .setDescription('The Order Management System API description')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // If the parse goes wrong during serialize dto response.
  // Come here and enable these filters to see the error.
  // app.useGlobalFilters(new ZodValidationExceptionFilter());
  // app.useGlobalFilters(new ZodSerializationExceptionFilter());
}

bootstrap();
