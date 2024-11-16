import {
  Brand,
  IPantryItem,
  Product,
  User,
  Volumes,
  Weights,
} from '@biaplanner/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BrandEntity } from '../brand/brand.entity';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../../user-info/user/user.entity';

@Entity('pantry-items')
export class PantryItemEntity implements IPantryItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  createdById?: number;

  @ManyToOne(() => UserEntity, (user) => user.pantryItems)
  createdBy?: User;

  @ManyToOne(() => ProductEntity, (product) => product.pantryItems)
  product: Product;

  @Column({ type: 'bigint', nullable: true })
  productId?: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  isExpired?: boolean;
}
