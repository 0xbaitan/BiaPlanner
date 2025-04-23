import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { ZodSchema } from 'zod';
import { createZodValidationPipe } from 'nestjs-zod';
import dot from 'dot-object';
import { transformFlatObjectToJson } from '@biaplanner/shared';

const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error) => {
    return new BadRequestException({
      message: 'Validation failed',
      errors: error.format(),
    });
  },
});

export default ZodValidationPipe;

@Injectable({ scope: Scope.REQUEST })
export class ZodParsePipe<T extends ZodSchema> implements PipeTransform {
  constructor(
    private readonly schema: T,
    private readonly isFormData: boolean = false,
  ) {}
  transform(value: unknown, metadata: ArgumentMetadata): T {
    const rawObject = Object.assign({}, value);
    const object = dot.object(rawObject);
    const parsed = this.schema.safeParse(object);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsed.error.format(),
        convertedObject: object,
        rawObject: value,
        type: typeof value,

        metadata,
      });
    }

    return parsed.data;
  }
}
