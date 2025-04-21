import {
  DifficultyLevels,
  IQueryRecipeDto,
  IRecipe,
  isUndefined,
  PaginateQuery,
  RecipeSortBy,
} from '@biaplanner/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { FilterOperator, paginate } from 'nestjs-paginate';

@Injectable()
export class QueryRecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<IRecipe>,
  ) {}

  private selectTotalTimeInMilliseconds(qb: SelectQueryBuilder<IRecipe>) {
    qb.setParameters({
      days: 24 * 60 * 60 * 1000, // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
      hours: 60 * 60 * 1000, // 60 minutes * 60 seconds * 1000 milliseconds
      minutes: 60 * 1000, // 60 seconds * 1000 milliseconds
      seconds: 1000, // 1000 milliseconds
    });
    qb.addSelect(
      `COALESCE(JSON_EXTRACT(cookingTime, '$.days'), 0) * :days 
      + COALESCE(JSON_EXTRACT(cookingTime, '$.hours'), 0) * :hours
      + COALESCE(JSON_EXTRACT(cookingTime, '$.minutes'), 0) * :minutes
      + COALESCE(JSON_EXTRACT(cookingTime, '$.seconds'), 0) * :seconds 
      + COALESCE(JSON_EXTRACT(prepTime, '$.days'), 0) * :days
      + COALESCE(JSON_EXTRACT(prepTime, '$.hours'), 0) * :hours
      + COALESCE(JSON_EXTRACT(prepTime, '$.minutes'), 0) * :minutes
      + COALESCE(JSON_EXTRACT(prepTime, '$.seconds'), 0) * :seconds`,
      'totalTimeInMilliseconds',
    );
  }

  private selectDifficultyScoring(qb: SelectQueryBuilder<IRecipe>) {
    qb.setParameters({
      easy: DifficultyLevels.EASY,
      medium: DifficultyLevels.MEDIUM,
      hard: DifficultyLevels.HARD,
    });
    qb.addSelect(
      `FIELD(recipe.difficultyLevel, :easy, :medium, :hard)`,
      'difficultyLevelScore',
    );
  }

  private applySorting(qb: SelectQueryBuilder<IRecipe>, sortBy: RecipeSortBy) {
    switch (sortBy) {
      case RecipeSortBy.RECIPE_DECREASING_DIFFICULTY_LEVEL:
        this.selectDifficultyScoring(qb);
        qb.addOrderBy('difficultyLevelScore', 'DESC');

        break;

      case RecipeSortBy.RECIPE_INCREASING_DIFFICULTY_LEVEL:
        this.selectDifficultyScoring(qb);
        qb.addOrderBy('difficultyLevelScore', 'ASC');
        break;

      case RecipeSortBy.RECIPE_TITLE_A_TO_Z:
        qb.addOrderBy('recipe.title', 'ASC');
        break;

      case RecipeSortBy.RECIPE_TITLE_Z_TO_A:
        qb.addOrderBy('recipe.title', 'DESC');
        break;

      case RecipeSortBy.RECIPE_MOST_TIME_CONSUMING:
        this.selectTotalTimeInMilliseconds(qb);
        qb.addOrderBy('totalTimeInMilliseconds', 'DESC');
        break;

      case RecipeSortBy.RECIPE_LEAST_TIME_CONSUMING:
        this.selectTotalTimeInMilliseconds(qb);
        qb.addOrderBy('totalTimeInMilliseconds', 'ASC');
        break;

      case RecipeSortBy.DEFAULT:
      default:
        qb.addOrderBy('recipe.createdAt', 'DESC');
        break;
    }
  }
  async query(query: IQueryRecipeDto) {
    console.log('Querying recipes with query:', query);

    const { sortBy, ...searchAndFilterQuery } = query;
    const qb = this.recipeRepository.createQueryBuilder('recipe');

    qb.leftJoinAndSelect('recipe.cuisine', 'cuisine')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient')
      .leftJoinAndSelect('ingredient.productCategories', 'productCategory')
      .leftJoinAndSelect('recipe.tags', 'tag');

    if (!!query.search && query.search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(recipe.title) LIKE LOWER(:search)', {
            search: `%${query.search}%`,
          })
            .orWhere('LOWER(recipe.description) LIKE LOWER(:search)', {
              search: `%${query.search}%`,
            })
            .orWhere('LOWER(ingredient.title) LIKE LOWER(:search)', {
              search: `%${query.search}%`,
            })
            .orWhere('LOWER(productCategory.name) LIKE LOWER(:search)', {
              search: `%${query.search}%`,
            })
            .orWhere('LOWER(tag.name) LIKE LOWER(:search)', {
              search: `%${query.search}%`,
            })
            .orWhere('LOWER(cuisine.name) LIKE LOWER(:search)', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    if (!!query.allergenIdsExclude && query.allergenIdsExclude.length > 0) {
      qb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('recipe.id')
          .from(RecipeEntity, 'recipe')
          .innerJoin('recipe.ingredients', 'ingredient')
          .innerJoin('ingredient.productCategories', 'productCategory')
          .where('productCategory.isAllergen = TRUE')
          .andWhere('productCategory.id IN (:...allergenIds)', {
            allergenIds: query.allergenIdsExclude,
          })
          .getQuery();
        return `recipe.id NOT IN ${subQuery}`;
      });
    }

    if (!!query.cuisineIds && query.cuisineIds.length > 0) {
      qb.andWhere('cuisine.id IN (:...cuisines)', {
        cuisines: query.cuisineIds,
      });
    }

    if (!!query.difficultyLevel) {
      qb.andWhere('recipe.difficultyLevel IN (:...difficultyLevels)', {
        difficultyLevels: query.difficultyLevel,
      });
    }

    if (!!query.recipeTagIds && query.recipeTagIds.length > 0) {
      qb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('recipe.id')
          .from(RecipeEntity, 'recipe')
          .innerJoin('recipe.tags', 'tag')
          .where('tag.id IN (:...tags)', {
            tags: query.recipeTagIds,
          })
          .getQuery();
        return `recipe.id IN ${subQuery}`;
      });
    }

    this.applySorting(qb, sortBy);

    return paginate(
      {
        ...searchAndFilterQuery,
        path: '/query/recipes',
      },
      qb,
      {
        defaultLimit: 25,
        sortableColumns: ['createdAt'],
      },
    );
  }

  async findOne(id: string): Promise<IRecipe> {
    return this.recipeRepository.findOneOrFail({
      where: { id },
      relations: ['cuisine', 'ingredients', 'tags'],
    });
  }
}
