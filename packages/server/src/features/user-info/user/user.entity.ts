import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUser, PantryItem, PhoneEntry, User } from '@biaplanner/shared';

import { PantryItemEntity } from 'src/features/pantry/pantry-item/pantry-item.entity';
import { PhoneEntryEntity } from '../phone-entry/phone-entry.entity';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

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
  phoneEntries?: PhoneEntry[];

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  pantryItems?: PantryItem[];
}
