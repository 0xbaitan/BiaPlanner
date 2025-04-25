import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { QueryBrandService } from './query-brand.service';
import {
  IQueryBrandParamsDto,
  IQueryBrandResultsDto,
  Paginated,
} from '@biaplanner/shared';
import { ZodQuery } from '@/util/zod-query.decorator';
import { QueryBrandParamsSchema } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryBrandParamsValidationPipe = new ZodValidationPipe(
  QueryBrandParamsSchema,
);

@Controller('/query/brands')
export class QueryBrandController {
  constructor(
    @Inject(QueryBrandService)
    private readonly queryBrandService: QueryBrandService,
  ) {}

  @Get()
  async queryBrands(
    @Query(QueryBrandParamsValidationPipe) query: IQueryBrandParamsDto,
  ): Promise<Paginated<IQueryBrandResultsDto>> {
    return this.queryBrandService.query(query);
  }
}
