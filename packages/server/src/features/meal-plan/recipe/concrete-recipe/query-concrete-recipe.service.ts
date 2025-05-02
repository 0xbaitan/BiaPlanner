import {
  ConcreteRecipeSortBy,
  IConcreteRecipe,
  IQueryConcreteRecipeDto,
} from '@biaplanner/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { paginate, Paginated } from 'nestjs-paginate';

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
        qb.addOrderBy('DATEDIFF(concreteRecipe.planDate, NOW())', 'ASC');
        break;
      case ConcreteRecipeSortBy.LEAST_URGENT:
        qb.addOrderBy('DATEDIFF(concreteRecipe.planDate, NOW())', 'DESC');
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
    query: IQueryConcreteRecipeDto,
  ): Promise<Paginated<IConcreteRecipe>> {
    console.log('Querying concrete recipes with query:', query);

    const { sortBy, search, mealType, page, limit } = query;

    const qb =
      this.concreteRecipeRepository.createQueryBuilder('concreteRecipe');

    qb.leftJoinAndSelect('concreteRecipe.recipe', 'recipe')
      .leftJoinAndSelect(
        'concreteRecipe.confirmedIngredients',
        'confirmedIngredients',
      )
      .leftJoinAndSelect(
        'confirmedIngredients.pantryItemsWithPortions',
        'pantryItemsWithPortions',
      )
      .leftJoinAndSelect('pantryItemsWithPortions.pantryItem', 'pantryItem');

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

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Paginate the results
    const results = await paginate<IConcreteRecipe>(
      {
        path: '/query/concrete-recipes',
        page,
        limit,
      },
      qb,
      {
        sortableColumns: ['createdAt', 'planDate'],
        defaultLimit: 10,
      },
    );

    return results;
  }
}
