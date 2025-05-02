import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { type INestApplication } from '@nestjs/common';
import { ZodValidationExceptionFilter } from './commons/filters/zod-validation-exception.filter';
import { ZodSerializationExceptionFilter } from './commons/filters/zod-serialization-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  registerGlobals(app);
  await app.listen(process.env.PORT ?? 3000);
}

export function registerGlobals(app: INestApplication) {
  // app.useGlobalFilters(new ZodValidationExceptionFilter());
  // app.useGlobalFilters(new ZodSerializationExceptionFilter());
}

bootstrap();
