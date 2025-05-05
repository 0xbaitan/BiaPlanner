import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { RoleEntity } from './role.entity';
import {
  IRole,
  IQueryRoleDto,
  Paginated,
  RolesSortBy,
} from '@biaplanner/shared';
import paginate from '@/util/paginate';

@Injectable()
export class QueryRoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(
    qb: SelectQueryBuilder<RoleEntity>,
    sortBy: RolesSortBy,
  ) {
    switch (sortBy) {
      case RolesSortBy.NAME_A_TO_Z:
        qb.addOrderBy('role.name', 'ASC');
        break;
      case RolesSortBy.NAME_Z_TO_A:
        qb.addOrderBy('role.name', 'DESC');
        break;
      case RolesSortBy.NEWEST:
        qb.addOrderBy('role.createdAt', 'DESC');
        break;
      case RolesSortBy.OLDEST:
        qb.addOrderBy('role.createdAt', 'ASC');
        break;
      default:
        qb.addOrderBy('role.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query roles with filters, search, and sorting.
   */
  async query(query: IQueryRoleDto): Promise<Paginated<IRole>> {
    console.log('Querying roles with query:', query);

    const { sortBy, search, page, limit } = query;

    const qb = this.roleRepository.createQueryBuilder('role');

    // Apply search filter
    if (search && search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(role.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          }).orWhere('LOWER(role.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Paginate the results
    const results = await paginate<IRole>(qb, page, limit, search);

    // Return the paginated results
    return results;
  }
}
