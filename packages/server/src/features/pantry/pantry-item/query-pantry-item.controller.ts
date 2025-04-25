import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryPantryItemService } from './query-pantry-item.service';
import {
  IQueryPantryItemFilterParams,
  QueryPantryItemParamsSchema,
  IPantryItem,
  Paginated,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';

const QueryPantryItemValidationPipe = new ZodValidationPipe(
  QueryPantryItemParamsSchema,
);

@Controller('/query/pantry-items')
export class QueryPantryItemController {
  constructor(
    @Inject(QueryPantryItemService)
    private readonly queryPantryItemService: QueryPantryItemService,
  ) {}

  @Get()
  async query(
    @Query(QueryPantryItemValidationPipe)
    query: IQueryPantryItemFilterParams,
  ): Promise<Paginated<IPantryItem>> {
    return this.queryPantryItemService.query(query);
  }
}
