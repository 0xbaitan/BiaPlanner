import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';

import { RecipeTagEntity } from './recipe-tag.entity';
import { IRecipeTag, Paginated } from '@biaplanner/shared';
import {
  IQueryRecipeTagDto,
  IQueryRecipeTagItemDto,
  QueryRecipeTagItemSchema,
  RecipeTagSortBy,
} from '@biaplanner/shared';
import { paginate } from 'nestjs-paginate';

import { raw } from 'mysql2';

@Injectable()
export class QueryRecipeTagService {
  constructor(
    @InjectRepository(RecipeTagEntity)
    private readonly recipeTagRepository: Repository<RecipeTagEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(
    qb: SelectQueryBuilder<RecipeTagEntity>,
    sortBy: RecipeTagSortBy,
  ) {
    switch (sortBy) {
      case RecipeTagSortBy.RECIPE_TAG_NAME_A_TO_Z:
        qb.addOrderBy('recipeTag.name', 'ASC');
        break;
      case RecipeTagSortBy.RECIPE_TAG_NAME_Z_TO_A:
        qb.addOrderBy('recipeTag.name', 'DESC');
        break;
      case RecipeTagSortBy.RECIPE_TAG_MOST_RECIPES:
        qb.addOrderBy('recipeCount', 'DESC');
        break;
      case RecipeTagSortBy.RECIPE_TAG_LEAST_RECIPES:
        qb.addOrderBy('recipeCount', 'ASC');
        break;

      case RecipeTagSortBy.DEFAULT:
      default:
        qb.addOrderBy('recipeTag.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query recipe tags with filters, search, and sorting.
   */
  async query(query: IQueryRecipeTagDto): Promise<Paginated<IRecipeTag>> {
    console.log('Querying recipe tags with query:', query);
    const { sortBy, search, page, limit } = query;

    const qb = this.recipeTagRepository.createQueryBuilder('recipeTag');

    qb.select([
      'recipeTag.id as id',
      'recipeTag.name as name',
      'recipeTag.description as description',
      'COUNT(recipe.id) as recipeCount',
    ]);
    // Join recipes to count the number of recipes associated with each tag
    qb.leftJoin('recipeTag.recipes', 'recipe');

    // Apply search filter
    if (search && search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(recipeTag.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(recipeTag.description) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(recipe.title) LIKE LOWER(:search)', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Group by recipe tag ID to get the count of recipes
    // Add GROUP BY clause to include all non-aggregated columns
    qb.groupBy('recipeTag.id, recipeTag.name, recipeTag.description');

    // Paginate the results
    const results = await paginate<IRecipeTag>(
      {
        path: 'recipe-tags',
        page,
        limit,
      },

      qb,

      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        maxLimit: 100,
      },
    );

    return results;
  }
  /**
   * Find a single recipe tag by ID.
   */
  async findOne(id: string): Promise<RecipeTagEntity> {
    return this.recipeTagRepository.findOneOrFail({
      where: { id },
      relations: ['recipes'],
    });
  }
}
