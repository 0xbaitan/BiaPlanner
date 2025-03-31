import {
  BaseEntity,
  DataSource,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { IBaseEntity } from '@biaplanner/shared';
import dataSource from '../db/ormconfig';

export class FuzzyQueryBuilder<
  T extends IBaseEntity,
> extends SelectQueryBuilder<T> {
  constructor(repository: Repository<T>) {
    super(dataSource.createQueryBuilder());
    this.from(repository.target, 'entity');
  }
}
