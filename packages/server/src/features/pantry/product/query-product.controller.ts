import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { QueryProductService } from './query-product.service';
import {
  IProduct,
  IQueryBrandDto,
  IQueryProductDto,
  IQueryTopBrandedProductsDto,
  QueryBrandDtoSchema,
  QueryProductDtoSchema,
  QueryTopBrandedProductsDtoSchema,
} from '@biaplanner/shared';
import { ZodQuery } from '@/util/zod-query.decorator';

import { ZodValidationPipe } from 'nestjs-zod';
import { Paginated } from 'nestjs-paginate';

const QueryProductParamsValidationPipe = new ZodValidationPipe(
  QueryProductDtoSchema,
);

const QueryTopBrandedProductsParamsValidationPipe = new ZodValidationPipe(
  QueryTopBrandedProductsDtoSchema,
);
@Controller('/query/products')
export class QueryProductController {
  constructor(
    @Inject(QueryProductService)
    private readonly queryProductService: QueryProductService,
  ) {}

  @Get()
  async queryProducts(
    @Query(QueryProductParamsValidationPipe) query: IQueryProductDto,
  ): Promise<Paginated<IProduct>> {
    return this.queryProductService.query(query);
  }

  @Get('/top-branded')
  async queryTopBrandedProducts(
    @Query(QueryTopBrandedProductsParamsValidationPipe)
    query: IQueryTopBrandedProductsDto,
  ): Promise<IProduct[]> {
    return this.queryProductService.queryTopBrandedProducts(query);
  }
}
