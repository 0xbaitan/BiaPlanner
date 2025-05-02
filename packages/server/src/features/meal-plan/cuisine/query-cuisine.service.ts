import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { paginate, Paginated } from 'nestjs-paginate';
import { CuisineEntity } from './cuisine.entity';
import { ICuisine, IQueryCuisineDto } from '@biaplanner/shared';

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

    qb.select([
      'cuisine.id',
      'cuisine.name',
      'cuisine.description',
      'COUNT(recipe.id) as recipeCount',
    ]);

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

    // Group by cuisine ID to get the count of recipes
    qb.groupBy('cuisine.id, cuisine.name, cuisine.description');

    // Paginate the results
    const results = await paginate<ICuisine>(
      {
        path: '/query/cuisines',
        page,
        limit,
      },
      qb,
      {
        sortableColumns: ['name', 'createdAt'],
        defaultLimit: 25,
      },
    );

    return results;
  }
}
