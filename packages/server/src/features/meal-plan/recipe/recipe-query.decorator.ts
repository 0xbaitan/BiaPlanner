import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import { QueryRecipeDto } from '@biaplanner/shared';
import qs from 'qs';
import { validate } from 'class-validator';

export const RecipeQuery = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = qs.parse(request.query);
    console.log('Querying recipes with query:', query);
    const recipeQueryDto = plainToInstance(QueryRecipeDto, query);
    console.log('Parsed query:', recipeQueryDto);

    const errors = await validate(recipeQueryDto);

    if (errors.length > 0) {
      throw new Error(`Validation failed! ${JSON.stringify(errors)}`);
    }
    return recipeQueryDto;
  },
);
