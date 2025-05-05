import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IPermissionGroup,
  IRole,
  IUser,
  ViewOnlyRoleValue,
} from '@biaplanner/shared';

import { UserEntity } from '../user/user.entity';

@Entity('roles')
export class RoleEntity implements IRole {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.roles, {
    cascade: ['update'],
  })
  users: IUser[];

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  permissions: IPermissionGroup;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: string;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: string;
}
