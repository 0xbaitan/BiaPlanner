import { Controller, Get, Inject, Module } from '@nestjs/common';
import { QueryRecipeService } from './query.recipe.service';
import { Paginate } from 'nestjs-paginate';
import { PaginateQuery } from '@biaplanner/shared';
import { Public } from '@/features/user-info/authentication/public.decorator';

@Controller('/query/recipes')
export class QueryRecipeController {
  constructor(
    @Inject(QueryRecipeService)
    private readonly queryRecipeService: QueryRecipeService,
  ) {}

  @Public()
  @Get()
  async query(@Paginate() query: PaginateQuery) {
    return this.queryRecipeService.query(query);
  }
}
