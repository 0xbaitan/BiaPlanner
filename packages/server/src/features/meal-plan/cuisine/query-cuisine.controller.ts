import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { QueryCuisineService } from './query-cuisine.service';

import { ZodQuery } from '@/util/zod-query.decorator';

import { ZodValidationPipe } from 'nestjs-zod';
import { IQueryCuisineDto, QueryCuisineDtoSchema } from '@biaplanner/shared';

const QueryCuisineParamsValidationPipe = new ZodValidationPipe(
  QueryCuisineDtoSchema,
);

@Controller('/query/cuisines')
export class QueryCuisineController {
  constructor(
    @Inject(QueryCuisineService)
    private readonly queryCuisineService: QueryCuisineService,
  ) {}

  @Public()
  @Get()
  async queryCuisines(
    @Query(QueryCuisineParamsValidationPipe) query: IQueryCuisineDto,
  ) {
    return this.queryCuisineService.query(query);
  }
}
