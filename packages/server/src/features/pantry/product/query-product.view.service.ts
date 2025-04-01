import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { QueryProductViewEntity } from './query-product.view.entity';
// import { FuzzyQueryBuilder } from '@/util/FuzzyQueryBuilder';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { ProductEntity, ProductEntityIndices } from './product.entity';
import { FuzzyQuery, IProduct } from '@biaplanner/shared';
import { Brackets } from 'typeorm';

@Injectable()
export class QueryProductViewService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // private applyFuzzyQuery(
  //   fuzzyQuery: FuzzyQuery,
  //   qb: FuzzyQueryBuilder<QueryProductViewEntity>,
  // ) {
  //   const { fields, searchTerm, strategy, scoreThreshold } = fuzzyQuery;
  //   if (fields.length === 0) {
  //     return qb;
  //   }

  //   qb = qb.andWhere(
  //     new Brackets((bracketsQb) => {
  //       let field = fields[0];
  //       bracketsQb.where(`TRIGRAM(${field}, :searchTerm) > :scoreThreshold`, {
  //         searchTerm,
  //         scoreThreshold,
  //       });
  //       for (let i = 1; i < fields.length; i++) {
  //         field = fields[i];
  //         bracketsQb.orWhere(
  //           `TRIGRAM(${field}, :searchTerm) > :scoreThreshold`,
  //           { searchTerm, scoreThreshold },
  //         );
  //       }
  //     }),
  //   );

  //   return qb;
  // }

  async queryProducts(paginatedQuery: PaginateQuery, fuzzyQuery?: FuzzyQuery) {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.description',
        'product.measurement',
        'product.measurementType',
        'brand.id',
        'brand.name',
      ]);

    if (paginatedQuery.search) {
      qb.addSelect(
        'MATCH(product.name, product.description) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)',
        'relevanceScore',
      );
    }
    qb.setParameter('searchTerm', paginatedQuery.search)
      .leftJoin('product.brand', 'brand')
      .leftJoinAndSelect('product.productCategories', 'productCategories');

    if (paginatedQuery.search) {
      qb.where(
        'MATCH(product.name, product.description) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE) > :scoreThreshold',
        {
          searchTerm: paginatedQuery.search,
          scoreThreshold: 0.2,
        },
      ).orWhere(
        'product.name LIKE :searchTerm OR product.description LIKE :searchTerm',
        {
          searchTerm: `%${paginatedQuery.search}%`,
        },
      );
      if (
        paginatedQuery.search.split(' ').length <= 2 &&
        paginatedQuery.search.length >= 3
      ) {
        qb.orWhere(
          new Brackets((qb) => {
            qb.where(
              'TRIGRAM_SEARCH(product.name, :searchTerm) > :scoreThreshold',
              {
                searchTerm: paginatedQuery.search,
                scoreThreshold: 0.2,
              },
            ).orWhere(
              'TRIGRAM_SEARCH(product.description, :searchTerm) > :scoreThreshold',
              {
                searchTerm: paginatedQuery.search,
                scoreThreshold: 0.2,
              },
            );
          }),
        );
      }
    }

    qb.orderBy('relevanceScore', 'DESC');

    // if (fuzzyQuery) {
    //   qb = this.applyFuzzyQuery(fuzzyQuery, qb);
    // }

    return paginate<DeepPartial<IProduct>>(paginatedQuery, qb, {
      sortableColumns: ['name'],
      filterableColumns: {
        name: [
          FilterOperator.CONTAINS,
          FilterOperator.ILIKE,
          FilterOperator.EQ,
        ],
      },
      searchableColumns: ['name', 'description'],
      defaultLimit: 25,
    });
  }
}
