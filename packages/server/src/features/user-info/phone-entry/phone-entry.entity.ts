import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IPhoneEntry, IUser } from '@biaplanner/shared';

import { UserEntity } from '../user/user.entity';

@Entity('phone-entries')
export class PhoneEntryEntity implements IPhoneEntry {
  userId?: string;

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  countryCode: string;

  @Column()
  countryCallingCode: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isForWork?: boolean;

  @Column({ default: false })
  isForHome?: boolean;

  @Column({ default: false })
  isMobile?: boolean;

  @Column({ default: false })
  isLandline?: boolean;

  @ManyToOne(() => UserEntity, (user) => user.phoneEntries)
  user?: IUser;

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
