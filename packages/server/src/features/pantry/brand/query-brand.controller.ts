import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryBrandService } from './query-brand.service';
import { IBrand, Paginated, QueryBrandDtoSchema } from '@biaplanner/shared';
import { IQueryBrandDto } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryBrandParamsValidationPipe = new ZodValidationPipe(
  QueryBrandDtoSchema,
);

@Controller('/query/brands')
export class QueryBrandController {
  constructor(
    @Inject(QueryBrandService)
    private readonly queryBrandService: QueryBrandService,
  ) {}

  @Get()
  async queryBrands(
    @Query(QueryBrandParamsValidationPipe) query: IQueryBrandDto,
  ): Promise<Paginated<IBrand>> {
    return this.queryBrandService.query(query);
  }
}
