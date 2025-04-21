import {
  IQueryRecipeDto,
  IRecipe,
  isUndefined,
  PaginateQuery,
} from '@biaplanner/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { FilterOperator, paginate } from 'nestjs-paginate';

@Injectable()
export class QueryRecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<IRecipe>,
  ) {}

  async query(query: IQueryRecipeDto) {
    console.log('Querying recipes with query:', query);
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

    return paginate(
      {
        ...query,
        path: '/query/recipes',
      },
      qb,
      {
        defaultLimit: 25,
        sortableColumns: ['title'],
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
