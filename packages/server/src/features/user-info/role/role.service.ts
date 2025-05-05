import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { IRole, IWriteRoleDto } from '@biaplanner/shared';
import { TransactionContext } from '@/util/transaction-context';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly transactionContext: TransactionContext,
  ) {}

  /**
   * Find a single role by ID.
   */
  async findOne(id: string): Promise<IRole> {
    return this.roleRepository.findOneOrFail({
      where: { id },
    });
  }

  /**
   * Find all roles.
   */
  async findAll(): Promise<IRole[]> {
    return this.roleRepository.find();
  }

  /**
   * Create a role.
   */
  async create(dto: IWriteRoleDto): Promise<IRole> {
    return this.createWithManager(this.roleRepository.manager, dto);
  }

  /**
   * Create a role using an EntityManager.
   */
  async createWithManager(
    manager: EntityManager,
    dto: IWriteRoleDto,
  ): Promise<IRole> {
    const role = manager.create(RoleEntity, dto);

    const result = await manager.insert(RoleEntity, role);

    if (!result.identifiers.length) {
      throw new InternalServerErrorException('Failed to create role');
    }

    return manager.findOneOrFail(RoleEntity, {
      where: { id: result.identifiers[0].id },
    });
  }

  /**
   * Update a role.
   */
  async update(id: string, dto: IWriteRoleDto): Promise<IRole> {
    return this.updateWithManager(this.roleRepository.manager, id, dto);
  }

  /**
   * Update a role using an EntityManager.
   */
  async updateWithManager(
    manager: EntityManager,
    id: string,
    dto: IWriteRoleDto,
  ): Promise<IRole> {
    const existingRole = await manager.findOneOrFail(RoleEntity, {
      where: { id },
    });

    Object.assign(existingRole, dto);

    await manager.save(RoleEntity, existingRole);

    return manager.findOneOrFail(RoleEntity, {
      where: { id },
    });
  }

  /**
   * Delete a role.
   */
  async delete(id: string): Promise<void> {
    return this.deleteWithManager(this.roleRepository.manager, id);
  }

  /**
   * Delete a role using an EntityManager.
   */
  async deleteWithManager(manager: EntityManager, id: string): Promise<void> {
    const role = await manager.findOneOrFail(RoleEntity, { where: { id } });

    await manager.remove(RoleEntity, role);
  }

  /**
   * Create a role with transaction.
   */
  async createWithTransaction(dto: IWriteRoleDto): Promise<IRole> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.createWithManager(manager, dto);
    });
  }

  /**
   * Update a role with transaction.
   */
  async updateWithTransaction(id: string, dto: IWriteRoleDto): Promise<IRole> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.updateWithManager(manager, id, dto);
    });
  }

  /**
   * Delete a role with transaction.
   */
  async deleteWithTransaction(id: string): Promise<void> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.deleteWithManager(manager, id);
    });
  }
}
