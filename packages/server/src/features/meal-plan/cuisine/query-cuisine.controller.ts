import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Public } from '@/features/user-info/authentication/public.decorator';
import { QueryCuisineService } from './query-cuisine.service';
import { IQueryCuisineParamsDto, Paginated } from '@biaplanner/shared';
import { ZodQuery } from '@/util/zod-query.decorator';
import { QueryCuisineParamsSchema } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryCuisineParamsValidationPipe = new ZodValidationPipe(
  QueryCuisineParamsSchema,
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
    @Query(QueryCuisineParamsValidationPipe) query: IQueryCuisineParamsDto,
  ): Promise<Paginated<any>> {
    return this.queryCuisineService.query(query);
  }
}
