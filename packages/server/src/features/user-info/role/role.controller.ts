import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { IRole, IWriteRoleDto } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { WriteRoleDtoSchema } from '@biaplanner/shared';

const WriteRoleValidationPipe = new ZodValidationPipe(WriteRoleDtoSchema);

@Controller('/user-info/roles')
export class RoleController {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IRole> {
    return this.roleService.findOne(id);
  }

  @Get()
  async findAll(): Promise<IRole[]> {
    return this.roleService.findAll();
  }

  @Post()
  async create(
    @Body(WriteRoleValidationPipe)
    dto: IWriteRoleDto,
  ): Promise<IRole> {
    return this.roleService.createWithTransaction(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(WriteRoleValidationPipe)
    dto: IWriteRoleDto,
  ): Promise<IRole> {
    return this.roleService.updateWithTransaction(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.roleService.deleteWithTransaction(id);
  }
}
