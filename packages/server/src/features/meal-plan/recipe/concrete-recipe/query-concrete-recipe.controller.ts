import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryConcreteRecipeService } from './query-concrete-recipe.service';
import {
  IQueryConcreteRecipeFilterParams,
  IQueryConcreteRecipeResultsDto,
  Paginated,
  QueryConcreteRecipeParamsSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';

const QueryConcreteRecipeValidationPipe = new ZodValidationPipe(
  QueryConcreteRecipeParamsSchema,
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
    query: IQueryConcreteRecipeFilterParams,
  ): Promise<Paginated<IQueryConcreteRecipeResultsDto>> {
    return this.queryConcreteRecipeService.query(query);
  }
}
