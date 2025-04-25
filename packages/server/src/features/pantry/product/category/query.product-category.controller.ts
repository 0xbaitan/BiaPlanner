import { FuzzyQueryParam } from '@/features/fuzzy-query-param.decorator';
import {
  FuzzyQuery,
  IQueryProductCategoryParamsDto,
  QueryProductCategoryParamsSchema,
} from '@biaplanner/shared';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { QueryProductCategoryService } from './query.product-category.service';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryProductCategoryValidation = new ZodValidationPipe(
  QueryProductCategoryParamsSchema,
);

@Controller('/query/product-categories')
export class QueryProductCategoryController {
  constructor(
    @Inject(QueryProductCategoryService)
    private readonly queryProductCategoryService: QueryProductCategoryService,
  ) {}

  @Get()
  async query(
    @Query(QueryProductCategoryValidation)
    query: IQueryProductCategoryParamsDto,
  ) {
    const results = await this.queryProductCategoryService.query(query);
    console.info('Querying product categories with query:', query);
    return results;
  }

  @Get('/allergens')
  async findAllAllergens() {
    return this.queryProductCategoryService.findAllAllergens();
  }
}
