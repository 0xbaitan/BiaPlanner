import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryShoppingListService } from './query-shopping-list.service';
import {
  IQueryShoppingListDto,
  IShoppingList,
  Paginated,
  QueryShoppingListDtoSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';

const QueryShoppingListValidationPipe = new ZodValidationPipe(
  QueryShoppingListDtoSchema,
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
    query: IQueryShoppingListDto,
  ): Promise<Paginated<IShoppingList>> {
    return this.queryShoppingListService.query(query);
  }
}
