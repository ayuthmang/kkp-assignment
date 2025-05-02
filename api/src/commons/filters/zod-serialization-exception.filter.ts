import { Catch, type ExceptionFilter } from '@nestjs/common';
import { ZodSerializationException } from 'nestjs-zod';

@Catch(ZodSerializationException)
export class ZodSerializationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodSerializationException) {
    const zodError = exception.getZodError();
    console.log('ZodSerializationExceptionFilter', { zodError });
  }
}
