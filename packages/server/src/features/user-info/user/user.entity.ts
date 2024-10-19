import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '@biaplanner/shared';
import { PhoneEntryEntity } from '../phone-entry/phone-entry.entity';
@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 0 })
  age: number;

  @OneToMany(() => PhoneEntryEntity, (phoneEntry) => phoneEntry.user)
  phoneEntries?: PhoneEntryEntity[];
}
