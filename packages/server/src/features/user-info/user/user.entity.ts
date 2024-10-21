import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PhoneEntryEntity } from '../phone-entry/phone-entry.entity';
import { User } from '@biaplanner/shared';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'timestamp' })
  dateOfBirth: Date;

  @OneToMany(() => PhoneEntryEntity, (phoneEntry) => phoneEntry.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  phoneEntries?: PhoneEntryEntity[];
}
