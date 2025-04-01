import { FuzzyQueryParam } from '@/features/fuzzy-query-param.decorator';
import { FuzzyQuery } from '@biaplanner/shared';
import { Controller, Get, Inject } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { QueryProductCategoryService } from './query.product-category.service';

@Controller('/query/product-categories')
export class QueryProductCategoryController {
  constructor(
    @Inject(QueryProductCategoryService)
    private readonly queryProductCategoryService: QueryProductCategoryService,
  ) {}

  @Get('/')
  async query(
    @Paginate() paginatedQuery: PaginateQuery,
    @FuzzyQueryParam() fuzzyQuery?: FuzzyQuery,
  ) {
    return this.queryProductCategoryService.queryProductCategories(
      paginatedQuery,
      fuzzyQuery,
    );
  }
}
