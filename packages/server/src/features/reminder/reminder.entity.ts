import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IReminder,
  IUser,
  PantryItem,
  ReminderMedium,
  ReminderStatus,
  User,
} from '@biaplanner/shared';

import { PantryItemEntity } from '../pantry/pantry-item/pantry-item.entity';
import { UserEntity } from '../user-info/user/user.entity';

@Entity('reminders')
export class ReminderEntity implements IReminder {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'number', nullable: false })
  pantryItemId?: number;

  @ManyToOne(() => PantryItemEntity, (pantryItem) => pantryItem.reminders)
  @JoinColumn({ name: 'pantryItemId' })
  pantryItem?: PantryItem;

  @Column({ type: 'timestamp', nullable: false })
  reminderDate?: string;

  @Column({
    type: 'enum',
    enum: ReminderMedium,
    nullable: false,
    default: ReminderMedium.EMAIL,
  })
  medium?: ReminderMedium;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    nullable: false,
    default: ReminderStatus.PENDING,
  })
  status?: ReminderStatus;
}
