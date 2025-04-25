import {
  ConcreteRecipeSortBy,
  IQueryConcreteRecipeFilterParams,
  IQueryConcreteRecipeResultsDto,
  MealTypes,
  Paginated,
  QueryConcreteRecipeResultsSchema,
} from '@biaplanner/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { paginate, paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { PantryItemEntity } from '@/features/pantry/pantry-item/pantry-item.entity';

@Injectable()
export class QueryConcreteRecipeService {
  constructor(
    @InjectRepository(ConcreteRecipeEntity)
    private readonly concreteRecipeRepository: Repository<ConcreteRecipeEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(
    qb: SelectQueryBuilder<ConcreteRecipeEntity>,
    sortBy: ConcreteRecipeSortBy,
  ) {
    switch (sortBy) {
      case ConcreteRecipeSortBy.RECIPE_TITLE_A_TO_Z:
        qb.addOrderBy('recipe.title', 'ASC');
        break;
      case ConcreteRecipeSortBy.RECIPE_TITLE_Z_TO_A:
        qb.addOrderBy('recipe.title', 'DESC');
        break;
      case ConcreteRecipeSortBy.NEWEST:
        qb.addOrderBy('concreteRecipe.createdAt', 'DESC');
        break;
      case ConcreteRecipeSortBy.OLDEST:
        qb.addOrderBy('concreteRecipe.createdAt', 'ASC');
        break;
      case ConcreteRecipeSortBy.MOST_UREGENT:
        qb.addOrderBy('daysTillPlanDate', 'ASC');
        break;
      case ConcreteRecipeSortBy.LEAST_URGENT:
        qb.addOrderBy('daysTillPlanDate', 'DESC');
        break;
      default:
        qb.addOrderBy('concreteRecipe.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query concrete recipes with filters, search, and sorting.
   */
  async query(
    query: IQueryConcreteRecipeFilterParams,
  ): Promise<Paginated<IQueryConcreteRecipeResultsDto>> {
    console.log('Querying concrete recipes with query:', query);

    const { sortBy, search, mealType, page, limit } = query;

    const qb =
      this.concreteRecipeRepository.createQueryBuilder('concreteRecipe');

    qb.select([
      'concreteRecipe.id AS concreteRecipeId',
      'recipe.id AS recipeId',
      'recipe.title AS recipeTitle',
      'concreteRecipe.planDate AS planDate',
      'concreteRecipe.numberOfServings AS numberOfServings',
      'concreteRecipe.mealType AS mealType',
      'DATEDIFF(concreteRecipe.planDate, NOW()) AS daysTillPlanDate',
    ]);

    // qb.addSelect((subQuery) => {
    //   return subQuery
    //     .select('pantryItem.id')
    //     .addSelect('pantryItem.expirationDate')
    //     .from(PantryItemEntity, 'pantryItem')
    //     .where('pantryItem.expirationDate IS NOT NULL')
    //     .andWhere('pantryItem.expirationDate <= NOW() + INTERVAL 7 DAY')
    //     .andWhere('pantryItem.id IN (SELECT pantryItem.id FROM pantryItem)');
    // }, 'itemsExpiringSoon');

    qb.leftJoin('concreteRecipe.recipe', 'recipe')
      .leftJoin('concreteRecipe.confirmedIngredients', 'confirmedIngredients')
      .leftJoin(
        'confirmedIngredients.pantryItemsWithPortions',
        'pantryItemsWithPortions',
      )
      .leftJoin('pantryItemsWithPortions.pantryItem', 'pantryItem');

    // Apply search filter
    if (search && search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(recipe.title) LIKE LOWER(:search)', {
            search: `%${search}%`,
          }).orWhere('LOWER(recipe.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Apply meal type filter
    if (!!mealType && mealType.length > 0) {
      qb.andWhere('concreteRecipe.mealType IN (:...mealType)', { mealType });
    }

    // Apply recipe title filter

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Paginate the results
    const rawResults = await paginateRaw(qb, {
      page,
      limit,
      metaTransformer: (meta) => ({
        ...meta,
        search: query.search,
        sortBy: query.sortBy,
        limit: query.limit,
        page: query.page,
      }),
    });

    console.log(rawResults);

    // Transform raw results using Zod schema
    const transformedResults = rawResults.items.map((item) =>
      QueryConcreteRecipeResultsSchema.parse(item),
    );

    return new Pagination(
      transformedResults,
      rawResults.meta,
      rawResults.links,
    );
  }
}
