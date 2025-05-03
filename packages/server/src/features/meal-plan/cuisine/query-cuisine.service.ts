import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { ICuisineExtended, Paginated } from '@biaplanner/shared';
import paginate from '@/util/paginate';
import { CuisineEntity } from './cuisine.entity';
import { ICuisine, IQueryCuisineDto } from '@biaplanner/shared';
import { RecipeEntity } from '../recipe/recipe.entity';

@Injectable()
export class QueryCuisineService {
  constructor(
    @InjectRepository(CuisineEntity)
    private readonly cuisineRepository: Repository<CuisineEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(qb: SelectQueryBuilder<CuisineEntity>, sortBy: string) {
    switch (sortBy) {
      case 'CUISINE_NAME_A_TO_Z':
        qb.addOrderBy('cuisine.name', 'ASC');
        break;
      case 'CUISINE_NAME_Z_TO_A':
        qb.addOrderBy('cuisine.name', 'DESC');
        break;
      case 'CUISINE_MOST_RECIPES':
        qb.addOrderBy('recipeCount', 'DESC');
        break;
      case 'CUISINE_LEAST_RECIPES':
        qb.addOrderBy('recipeCount', 'ASC');
        break;
      case 'DEFAULT':
      default:
        qb.addOrderBy('cuisine.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query cuisines with filters, search, and sorting.
   */
  async query(query: IQueryCuisineDto): Promise<Paginated<ICuisine>> {
    console.log('Querying cuisines with query:', query);
    const { sortBy = 'DEFAULT', search = '', page = 1, limit = 25 } = query;

    const qb = this.cuisineRepository.createQueryBuilder('cuisine');

    qb.addSelect((subQuery: SelectQueryBuilder<CuisineEntity>) => {
      return subQuery
        .select('COUNT(recipe.id)', 'recipeCount')
        .from(RecipeEntity, 'recipe')
        .where('recipe.cuisineId = cuisine.id');
    }, 'recipeCount');

    // Join recipes to count the number of recipes associated with each cuisine
    qb.leftJoin('cuisine.recipes', 'recipe');

    // Apply search filter
    if (search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(cuisine.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          }).orWhere('LOWER(cuisine.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Paginate the
    const results = await paginate<ICuisine, ICuisineExtended>(
      qb,
      page,
      limit,
      search,
      (entities, raw) => {
        return entities.map((entity, index) => ({
          ...entity,
          recipeCount: Number(raw[index].recipeCount),
        }));
      },
    );

    return results;
  }
}
