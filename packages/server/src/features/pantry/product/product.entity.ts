import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IProduct,
  PantryItem,
  ProductClassification,
} from '@biaplanner/shared';

import { PantryItemEntity } from '../pantry-item/pantry-item.entity';
import { ProductClassificationEntity } from './classification/product-classification.entity';
import { UserEntity } from 'src/features/user-info/user/user.entity';

@Entity('products')
export class ProductEntity implements IProduct {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(
    () => ProductClassificationEntity,
    (productClassification) => productClassification.products,
  )
  productClassification?: ProductClassification;

  @Column({ type: 'bigint' })
  productClassificationId?: number;

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.product)
  @JoinColumn({ name: 'productId' })
  pantryItems?: PantryItem[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  user?: UserEntity;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;

  @Column({ type: 'boolean', default: true })
  isGlobal?: boolean;
}
