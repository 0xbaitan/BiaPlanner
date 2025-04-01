import {
  BaseEntity,
  DataSource,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  PaginateConfig,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';

import { IBaseEntity } from '@biaplanner/shared';
import { dataSourceOptions } from '../db/ormconfig';

// export class FuzzyQueryBuilder<T> extends SelectQueryBuilder<T> {
//   constructor(
//     @InjectDataSource(dataSourceOptions)
//     private readonly dataSource: DataSource,
//     repository: Repository<T>,
//     alias: string = 'this',
//   ) {
//     super(this. dataSource.createQueryBuilder(repository.target, alias));
//   }

//   withTrigramSearch(
//     entity: string,
//     field: string,
//     searchString: string,
//     scoreThreshold: number = 0.4,
//   ): FuzzyQueryBuilder<T> {
//     return this.andWhere(
//       `TRIGRAM(${entity}.${field}, :searchString) > :scoreThreshold`,
//       { searchString, scoreThreshold },
//     );
//   }

//   findPaginatedMany(
//     query: PaginateQuery,
//     config: PaginateConfig<T>,
//   ): Promise<Paginated<T>> {
//     return paginate<T>(query, this, config);
//   }
// }
