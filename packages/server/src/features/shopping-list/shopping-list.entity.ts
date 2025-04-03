import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IShoppingItem, IShoppingList } from '@biaplanner/shared';

import { ShoppingItemEntity } from './shopping-item/shopping-item.entity';

@Entity('shopping-lists')
export class ShoppingListEntity implements IShoppingList {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

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

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  plannedDate: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isShoppingComplete?: boolean;

  @OneToMany(
    () => ShoppingItemEntity,
    (shoppingItem) => shoppingItem.shoppingList,
    { cascade: true, eager: true, onDelete: 'CASCADE' },
  )
  items?: IShoppingItem[];
}
