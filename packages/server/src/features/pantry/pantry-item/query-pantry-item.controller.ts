import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryPantryItemService } from './query-pantry-item.service';
import {
  IQueryPantryItemDto,
  QueryPantryItemDtoSchema,
  IPantryItem,
  Paginated,
  QueryCompatiblePantryItemDtoSchema,
  IQueryCompatiblePantryItemDto,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';

const QueryPantryItemValidationPipe = new ZodValidationPipe(
  QueryPantryItemDtoSchema,
);

const QueryPantryItemCompatibleValidationPipe = new ZodValidationPipe(
  QueryCompatiblePantryItemDtoSchema,
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
    query: IQueryPantryItemDto,
  ): Promise<Paginated<IPantryItem>> {
    return this.queryPantryItemService.query(query);
  }

  @Public()
  @Get('/compatible')
  async queryCompatible(
    @Query(QueryPantryItemCompatibleValidationPipe)
    query: IQueryCompatiblePantryItemDto,
  ): Promise<IPantryItem[]> {
    return this.queryPantryItemService.findIngredientCompatiblePantryItems(
      query,
    );
  }
}
