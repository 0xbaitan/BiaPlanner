import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';

import { RecipeTagEntity } from './recipe-tag.entity';
import { IRecipeTag, IRecipeTagExtended, Paginated } from '@biaplanner/shared';
import { IQueryRecipeTagDto, RecipeTagSortBy } from '@biaplanner/shared';

import { RecipeEntity } from '../recipe.entity';
import paginate from '@/util/paginate';

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
  async query(
    query: IQueryRecipeTagDto,
  ): Promise<Paginated<IRecipeTagExtended>> {
    const { sortBy, search, page = 1, limit = 25 } = query;

    const qb = this.recipeTagRepository.createQueryBuilder('recipeTag');

    qb.distinct(true);

    qb.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(recipe.id)', 'recipeCount')
        .from(RecipeEntity, 'recipe')
        .leftJoin('recipe.tags', 'tag')
        .where('tag.id = recipeTag.id');
    }, 'recipeCount');

    // Only join for counting, not selecting the full recipe entity
    qb.leftJoinAndSelect('recipeTag.recipes', 'recipe');

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

    // Paginate the results
    return paginate<IRecipeTag, IRecipeTagExtended>(
      qb,
      page,
      limit,
      search,
      (entities, raw) => {
        const extendedRecipeTags: IRecipeTagExtended[] = entities.map((tag) => {
          const index = raw.findIndex((r) => r.recipeTag_id === tag.id);
          return {
            ...tag,
            recipeCount: index !== -1 ? Number(raw[index].recipeCount) : 0,
          };
        });
        return extendedRecipeTags;
      },
    );
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
