import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { QueryProductService } from './query-product.service';
import {
  IProduct,
  IQueryProductParamsDto,
  IQueryTopBrandedProductsParamsDto,
  Paginated,
  QueryTopBrandedProductsParamsSchema,
} from '@biaplanner/shared';
import { ZodQuery } from '@/util/zod-query.decorator';
import { QueryProductParamsSchema } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryProductParamsValidationPipe = new ZodValidationPipe(
  QueryProductParamsSchema,
);

const QueryTopBrandedProductsParamsValidationPipe = new ZodValidationPipe(
  QueryTopBrandedProductsParamsSchema,
);
@Controller('/query/products')
export class QueryProductController {
  constructor(
    @Inject(QueryProductService)
    private readonly queryProductService: QueryProductService,
  ) {}

  @Get()
  async queryProducts(
    @Query(QueryProductParamsValidationPipe) query: IQueryProductParamsDto,
  ): Promise<Paginated<any>> {
    return this.queryProductService.query(query);
  }

  // @Public()
  // @Get('/top-branded')
  // async queryTopBrandedProducts(
  //   @Query(QueryTopBrandedProductsParamsValidationPipe)
  //   query: IQueryTopBrandedProductsParamsDto,
  // ): Promise<IProduct[]> {
  //   return this.queryProductService.queryTopBrandedProducts(query);
  // }
}
