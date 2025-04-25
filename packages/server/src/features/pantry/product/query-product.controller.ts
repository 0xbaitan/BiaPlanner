import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { QueryProductService } from './query-product.service';
import { IQueryProductParamsDto, Paginated } from '@biaplanner/shared';
import { ZodQuery } from '@/util/zod-query.decorator';
import { QueryProductParamsSchema } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryProductParamsValidationPipe = new ZodValidationPipe(
  QueryProductParamsSchema,
);

@Controller('/query/products')
export class QueryProductController {
  constructor(
    @Inject(QueryProductService)
    private readonly queryProductService: QueryProductService,
  ) {}

  @Public()
  @Get()
  async queryProducts(
    @Query(QueryProductParamsValidationPipe) query: IQueryProductParamsDto,
  ): Promise<Paginated<any>> {
    return this.queryProductService.query(query);
  }
}
