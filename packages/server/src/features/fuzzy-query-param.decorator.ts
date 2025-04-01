import {
  ExecutionContext,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { FuzzyQuery, isFuzzyQuery } from '@biaplanner/shared';

import { Paginate } from 'nestjs-paginate';

export const FuzzyQueryParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.query) {
      return undefined;
    }

    const fuzzy = request.query.fuzzy;
    if (isFuzzyQuery(fuzzy)) {
      return fuzzy;
    }
    return undefined;
  },
);
