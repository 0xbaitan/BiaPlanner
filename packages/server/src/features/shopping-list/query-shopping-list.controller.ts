import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryShoppingListService } from './query-shopping-list.service';
import {
  IQueryShoppingListFilterParams,
  IQueryShoppingListResultsDto,
  IShoppingList,
  Paginated,
  QueryShoppingListParamsSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';

const QueryShoppingListValidationPipe = new ZodValidationPipe(
  QueryShoppingListParamsSchema,
);

@Controller('/query/shopping-lists')
export class QueryShoppingListController {
  constructor(
    @Inject(QueryShoppingListService)
    private readonly queryShoppingListService: QueryShoppingListService,
  ) {}

  @Public()
  @Get()
  async query(
    @Query(QueryShoppingListValidationPipe)
    query: IQueryShoppingListFilterParams,
  ): Promise<Paginated<IShoppingList>> {
    return this.queryShoppingListService.query(query);
  }
}
