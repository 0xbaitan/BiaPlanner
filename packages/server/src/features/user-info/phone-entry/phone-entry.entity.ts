import { PhoneEntry } from '@biaplanner/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
