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
          });
        }),
      );
    }

    if (!!query.allergensExclude && query.allergensExclude.length > 0) {
      qb.andWhere('productCategory.name  NOT IN (:...allergens)', {
        allergens: query.allergensExclude,
      });
    }

    if (!!query.cuisines && query.cuisines.length > 0) {
      qb.andWhere('cuisine.name IN (:...cuisines)', {
        cuisines: query.cuisines,
      });
    }

    if (!!query.difficultyLevel) {
      qb.andWhere('recipe.difficultyLevel = :difficultyLevel', {
        difficultyLevel: query.difficultyLevel,
      });
    }

    if (!!query.recipeTags && query.recipeTags.length > 0) {
      qb.andWhere('tag.name IN (:...recipeTags)', {
        recipeTags: query.recipeTags,
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
