import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';

import { ShoppingListEntity } from './shopping-list.entity';
import {
  IQueryShoppingListDto,
  ShoppingListSortBy,
  Paginated,
  IShoppingList,
} from '@biaplanner/shared';
import paginate from '@/util/paginate';

@Injectable()
export class QueryShoppingListService {
  constructor(
    @InjectRepository(ShoppingListEntity)
    private readonly shoppingListRepository: Repository<ShoppingListEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(
    qb: SelectQueryBuilder<ShoppingListEntity>,
    sortBy: ShoppingListSortBy,
  ) {
    switch (sortBy) {
      case ShoppingListSortBy.TITLE_A_TO_Z:
        qb.addOrderBy('shoppingList.title', 'ASC');
        break;
      case ShoppingListSortBy.TITLE_Z_TO_A:
        qb.addOrderBy('shoppingList.title', 'DESC');
        break;
      case ShoppingListSortBy.NEWEST:
        qb.addOrderBy('shoppingList.createdAt', 'DESC');
        break;
      case ShoppingListSortBy.OLDEST:
        qb.addOrderBy('shoppingList.createdAt', 'ASC');
        break;
      case ShoppingListSortBy.MOST_URGENT:
        qb.addOrderBy('shoppingList.plannedDate', 'ASC');
        break;
      case ShoppingListSortBy.LEAST_URGENT:
        qb.addOrderBy('shoppingList.plannedDate', 'DESC');
        break;
      default:
        qb.addOrderBy('shoppingList.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query shopping lists with filters, search, and sorting.
   */
  async query(query: IQueryShoppingListDto): Promise<Paginated<IShoppingList>> {
    const { sortBy, search, plannedDate, page, limit } = query;

    const qb = this.shoppingListRepository.createQueryBuilder('shoppingList');

    qb.leftJoin('shoppingList.items', 'items').leftJoin(
      'items.product',
      'product',
    );

    // Apply search filter
    if (search && search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(shoppingList.title) LIKE LOWER(:search)', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(shoppingList.notes) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(product.name) LIKE LOWER(:search)', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Apply planned date filter
    if (plannedDate) {
      qb.andWhere('shoppingList.plannedDate = :plannedDate', { plannedDate });
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    qb.addGroupBy('shoppingList.id');
    qb.addGroupBy('shoppingList.title');
    qb.addGroupBy('shoppingList.notes');
    qb.addGroupBy('shoppingList.plannedDate');
    qb.addGroupBy('shoppingList.isShoppingComplete');
    qb.addGroupBy('shoppingList.createdAt');

    // Paginate the results
    const results = await paginate<IShoppingList>(qb, page, limit, search);
    return results;
  }
}
