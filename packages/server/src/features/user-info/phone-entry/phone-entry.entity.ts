import { PhoneEntry } from '@biaplanner/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('phone-entries')
export class PhoneEntryEntity implements PhoneEntry {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

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
  user?: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
