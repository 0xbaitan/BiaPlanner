import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IProduct, IShoppingItem, IShoppingList } from '@biaplanner/shared';

import { ProductEntity } from '@/features/pantry/product/product.entity';
import { ShoppingListEntity } from '../shopping-list.entity';

@Entity('shopping-items')
export class ShoppingItemEntity implements IShoppingItem {
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

  @Column({ type: 'bigint', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (product) => product.id, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  product?: IProduct;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'bigint', nullable: true })
  replacementId?: string;

  @OneToOne(() => ShoppingItemEntity, (shoppingItem) => shoppingItem.id)
  @JoinColumn({ name: 'replacementId' })
  replacement?: IShoppingItem;

  @Column({ type: 'bigint', nullable: false })
  shoppingListId?: string;

  @ManyToOne(() => ShoppingListEntity, (shoppingList) => shoppingList.id)
  shoppingList?: IShoppingList;

  @Column({ type: 'boolean', nullable: true, default: false })
  isReplaced?: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isChecked?: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isCancelled?: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isExtra?: boolean;
}
