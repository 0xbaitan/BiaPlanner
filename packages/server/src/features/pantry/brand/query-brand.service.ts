import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { BrandEntity } from './brand.entity';
import {
  IQueryBrandParamsDto,
  IQueryBrandResultsDto,
  QueryBrandResultsSchema,
} from '@biaplanner/shared';

@Injectable()
export class QueryBrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(qb: SelectQueryBuilder<BrandEntity>, sortBy: string) {
    switch (sortBy) {
      case 'BRAND_NAME_A_TO_Z':
        qb.addOrderBy('brand.name', 'ASC');
        break;
      case 'BRAND_NAME_Z_TO_A':
        qb.addOrderBy('brand.name', 'DESC');
        break;
      case 'BRAND_MOST_PRODUCTS':
        qb.addOrderBy('productCount', 'DESC');
        break;
      case 'BRAND_LEAST_PRODUCTS':
        qb.addOrderBy('productCount', 'ASC');
        break;
      case 'DEFAULT':
      default:
        qb.addOrderBy('brand.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query brands with filters, search, and sorting.
   */
  async query(
    query: IQueryBrandParamsDto,
  ): Promise<Pagination<IQueryBrandResultsDto>> {
    console.log('Querying brands with query:', query);
    const { sortBy = 'DEFAULT', search = '', page = 1, limit = 25 } = query;

    const qb = this.brandRepository.createQueryBuilder('brand');

    qb.select([
      'brand.id as id',
      'brand.name as name',
      'brand.description as description',
      'brand.logoId as logoId',
      'COUNT(product.id) as productCount',
    ]);

    // Join products to count the number of products associated with each brand
    qb.leftJoin('brand.products', 'product');

    // Apply search filter
    if (search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(brand.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          }).orWhere('LOWER(brand.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Group by brand ID to get the count of products
    qb.groupBy('brand.id, brand.name, brand.description, brand.logoId');

    // Paginate the results
    const rawResults = await paginateRaw(qb, {
      page,
      limit,
      metaTransformer: (meta) => ({
        ...meta,
        search: query.search,
        sortBy: query.sortBy,
        limit: query.limit,
      }),
    });

    console.log(rawResults);

    const hydratedResults = await Promise.all(
      rawResults.items.map(async (item) => {
        const brand = await this.brandRepository.findOne({
          where: { id: item.id },
          relations: ['logo'],
        });

        return {
          ...item,
          imageFileMetadata: brand?.logo,
        };
      }),
    );

    // Transform raw results using Zod schema
    const transformedResults = hydratedResults.map((item) =>
      QueryBrandResultsSchema.parse(item),
    );

    return new Pagination<IQueryBrandResultsDto>(
      transformedResults,
      rawResults.meta,
      rawResults.links,
    );
  }
}
