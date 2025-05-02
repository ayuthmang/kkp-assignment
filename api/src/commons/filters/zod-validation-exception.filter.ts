import { Catch, type ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException) {
    const zodError = exception.getZodError(); // -> ZodError
    console.log('ZodValidationExceptionFilter', { zodError });
  }
}
