import {
  IQueryProductCategoryDto,
  QueryProductCategoryDtoSchema,
} from '@biaplanner/shared';
import { Controller, Get, Inject, Query } from '@nestjs/common';

import { QueryProductCategoryService } from './query.product-category.service';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryProductCategoryValidation = new ZodValidationPipe(
  QueryProductCategoryDtoSchema,
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
    query: IQueryProductCategoryDto,
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
