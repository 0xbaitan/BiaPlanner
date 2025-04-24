import { Controller, Get, Inject, Query } from '@nestjs/common';

import { Public } from '@/features/user-info/authentication/public.decorator';

import { IQueryRecipeTagDto, QueryRecipeTagDto } from '@biaplanner/shared';
import { QueryRecipeTagService } from './query-recipe-tag.service';
import { ZodQuery } from '@/util/zod-query.decorator';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryRecipeTagValidation = new ZodValidationPipe(
  QueryRecipeTagDto.schema,
);

@Controller('/query/recipe-tags')
export class QueryRecipeTagController {
  constructor(
    @Inject(QueryRecipeTagService)
    private readonly queryRecipeTagService: QueryRecipeTagService,
  ) {}

  @Get()
  async query(@Query(QueryRecipeTagValidation) query: IQueryRecipeTagDto) {
    const results = await this.queryRecipeTagService.query(query);
    console.info('Querying recipe tags with query:', results);
    return results;
  }
}
