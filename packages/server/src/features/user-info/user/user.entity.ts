import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IPantryItem,
  IPhoneEntry,
  IProduct,
  IRole,
  IUser,
} from '@biaplanner/shared';

import { PantryItemEntity } from 'src/features/pantry/pantry-item/pantry-item.entity';
import { PhoneEntryEntity } from '../phone-entry/phone-entry.entity';
import { ProductEntity } from 'src/features/pantry/product/product.entity';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'timestamp' })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => PhoneEntryEntity, (phoneEntry) => phoneEntry.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  phoneEntries?: IPhoneEntry[];

  @OneToMany(() => ProductEntity, (product) => product.createdBy, {
    cascade: true,
  })
  @JoinColumn({ name: 'createdById' })
  products?: IProduct[];

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.createdBy, {
    cascade: true,
  })
  @JoinColumn({ name: 'createdById' })
  pantryItems?: IPantryItem[];

  @ManyToMany(() => UserEntity, (user) => user.roles, {
    cascade: false,
    onDelete: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: IRole[];

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

  @Column({ default: false })
  isAdmin: boolean;
}
