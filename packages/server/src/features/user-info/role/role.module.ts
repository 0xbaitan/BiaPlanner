import { Module } from '@nestjs/common';
import { QueryRoleController } from './query-role.controller';
import { QueryRoleService } from './query-role.service';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';
import { TransactionContext } from '@/util/transaction-context';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController, QueryRoleController],
  providers: [RoleService, QueryRoleService],
  exports: [RoleService],
})
export class RoleModule {}
