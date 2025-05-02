import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryConcreteRecipeService } from './query-concrete-recipe.service';
import {
  IConcreteRecipe,
  IQueryConcreteRecipeDto,
  QueryConcreteRecipeDtoSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { Paginated } from 'nestjs-paginate';

const QueryConcreteRecipeValidationPipe = new ZodValidationPipe(
  QueryConcreteRecipeDtoSchema,
);

@Controller('/query/concrete-recipes')
export class QueryConcreteRecipeController {
  constructor(
    @Inject(QueryConcreteRecipeService)
    private readonly queryConcreteRecipeService: QueryConcreteRecipeService,
  ) {}

  @Get()
  async query(
    @Query(QueryConcreteRecipeValidationPipe)
    query: IQueryConcreteRecipeDto,
  ): Promise<Paginated<IConcreteRecipe>> {
    return this.queryConcreteRecipeService.query(query);
  }
}
