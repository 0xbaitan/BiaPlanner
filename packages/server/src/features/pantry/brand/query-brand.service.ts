import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import paginate from '@/util/paginate';
import { BrandEntity } from './brand.entity';
import {
  IBrand,
  IBrandExtended,
  IQueryBrandDto,
  Paginated,
} from '@biaplanner/shared';
import { ProductEntity } from '../product/product.entity';

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
  async query(query: IQueryBrandDto): Promise<Paginated<IBrand>> {
    console.log('Querying brands with query:', query);
    const { sortBy = 'DEFAULT', search = '', page = 1, limit = 25 } = query;

    const qb = this.brandRepository.createQueryBuilder('brand');

    qb.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(product.id)', 'productCount')
        .from(ProductEntity, 'product')
        .leftJoin('product.brand', 'productBrand')
        .where('productBrand.id = brand.id');
    }, 'productCount');

    // Join products to count the number of products associated with each brand
    qb.leftJoinAndSelect('brand.products', 'product');

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

    // Paginate the results
    const results = await paginate<IBrand, IBrandExtended>(
      qb,
      page,
      limit,
      search,
      (entities, raw) => {
        const extendedBrands: IBrandExtended[] = entities.map(
          (brand, index) => {
            return {
              ...brand,
              productCount: Number(raw[index].productCount),
            };
          },
        );

        return extendedBrands;
      },
    );

    return results;
  }
}
