import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CookingMeasurement,
  IBrand,
  IPantryItem,
  IPantryItemPortion,
  IProduct,
  IReminder,
  IUser,
  Volumes,
  Weights,
} from '@biaplanner/shared';

import { BrandEntity } from '../brand/brand.entity';
import { PantryItemPortionEntity } from '@/features/meal-plan/recipe/pantry-item-portion/pantry-item-portion.entity';
import { ProductEntity } from '../product/product.entity';
import { ReminderEntity } from 'src/features/reminder/reminder.entity';
import { UserEntity } from '../../user-info/user/user.entity';

@Entity('pantry-items')
export class PantryItemEntity implements IPantryItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: true })
  createdById?: string;

  @ManyToOne(() => UserEntity, (user) => user.pantryItems)
  createdBy?: IUser;

  @ManyToOne(() => ProductEntity, (product) => product.pantryItems)
  product: IProduct;

  @Column({ type: 'bigint', nullable: true })
  productId?: string;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  bestBeforeDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  openedDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  manufacturedDate?: string;

  @Column({ default: false })
  isExpired?: boolean;

  @OneToMany(() => PantryItemPortionEntity, (portion) => portion.pantryItem)
  pantryItemPortions?: IPantryItemPortion[];

  @OneToMany(() => ReminderEntity, (reminder) => reminder.pantryItem)
  reminders?: IReminder[];

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

  @Column({ type: 'json', nullable: true })
  totalMeasurements?: CookingMeasurement;

  @Column({ type: 'json', nullable: true })
  availableMeasurements?: CookingMeasurement;

  @Column({ type: 'json', nullable: true })
  consumedMeasurements?: CookingMeasurement;

  @Column({ type: 'json', nullable: true })
  reservedMeasurements?: CookingMeasurement;
}
