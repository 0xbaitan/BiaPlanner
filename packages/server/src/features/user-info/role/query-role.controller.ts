import { Controller, Get, Inject, Query } from '@nestjs/common';
import { QueryRoleService } from './query-role.service';
import {
  IRole,
  IQueryRoleDto,
  QueryRoleDtoSchema,
  Paginated,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const QueryRoleValidationPipe = new ZodValidationPipe(QueryRoleDtoSchema);

@Controller('/query/roles')
export class QueryRoleController {
  constructor(
    @Inject(QueryRoleService)
    private readonly queryRoleService: QueryRoleService,
  ) {}

  @Get()
  async query(
    @Query(QueryRoleValidationPipe)
    query: IQueryRoleDto,
  ): Promise<Paginated<IRole>> {
    return this.queryRoleService.query(query);
  }
}
