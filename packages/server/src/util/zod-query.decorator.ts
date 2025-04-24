import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';

import { ZodSchema } from 'zod';
import qs from 'qs';

export const ZodQuery = (schema: ZodSchema) =>
  createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    throw new Error('Query is not parsed yet');
    console.log('ZodQuery', query);
    const parsedQuery = await schema.safeParseAsync(query);
    console.log('parsedQuery', parsedQuery);
    if (!parsedQuery.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsedQuery.error.flatten(),
        convertedObject: parsedQuery.data,
        rawObject: query,
        type: typeof query,
      });
    }

    return parsedQuery;
  }) as ParameterDecorator;
