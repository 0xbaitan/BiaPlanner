import { Controller, Get, Inject } from '@nestjs/common';
import { QueryProductViewService } from './query-product.view.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FuzzyQueryParam } from '@/features/fuzzy-query-param.decorator';
import { FuzzyQuery } from '@biaplanner/shared';

@Controller('/query/products')
export class QueryProductViewController {
  constructor(
    @Inject(QueryProductViewService)
    private readonly queryProductViewService: QueryProductViewService,
  ) {}

  @Get('/')
  async getProducts(
    @Paginate() paginatedQuery: PaginateQuery,
    @FuzzyQueryParam() fuzzyQuery?: FuzzyQuery,
  ) {
    return this.queryProductViewService.queryProducts(
      paginatedQuery,
      fuzzyQuery,
    );
  }
}
