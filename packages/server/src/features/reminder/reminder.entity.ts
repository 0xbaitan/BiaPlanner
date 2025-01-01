import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IPantryItem,
  IReminder,
  ReminderMedium,
  ReminderStatus,
} from '@biaplanner/shared';

import { PantryItemEntity } from '../pantry/pantry-item/pantry-item.entity';

@Entity('reminders')
export class ReminderEntity implements IReminder {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  pantryItemId: string;

  @ManyToOne(() => PantryItemEntity, (pantryItem) => pantryItem.reminders)
  @JoinColumn({ name: 'pantryItemId' })
  pantryItem?: IPantryItem;

  @Column({ type: 'timestamp', nullable: false })
  reminderDate: string;

  @Column({
    type: 'enum',
    enum: ReminderMedium,
    nullable: false,
    default: ReminderMedium.EMAIL,
  })
  medium: ReminderMedium;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    nullable: false,
    default: ReminderStatus.PENDING,
  })
  status: ReminderStatus;

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
