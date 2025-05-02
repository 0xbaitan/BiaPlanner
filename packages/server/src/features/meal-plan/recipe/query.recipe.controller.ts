import { Controller, Get, Inject, Module, Query } from '@nestjs/common';
import { QueryRecipeService } from './query.recipe.service';
import { Paginate } from 'nestjs-paginate';
import {
  IQueryRecipeDto,
  IRecipe,
  Paginated,
  QueryRecipeDtoSchema,
} from '@biaplanner/shared';
import { Public } from '@/features/user-info/authentication/public.decorator';

import { ZodValidationPipe } from 'nestjs-zod';

const QueryRecipeParamsValidationPipe = new ZodValidationPipe(
  QueryRecipeDtoSchema,
);

@Controller('/query/recipes')
export class QueryRecipeController {
  constructor(
    @Inject(QueryRecipeService)
    private readonly queryRecipeService: QueryRecipeService,
  ) {}

  @Public()
  @Get()
  async query(
    @Query(QueryRecipeParamsValidationPipe) query: IQueryRecipeDto,
  ): Promise<Paginated<IRecipe>> {
    return this.queryRecipeService.query(query);
  }
  eryRecipeDto;
}
