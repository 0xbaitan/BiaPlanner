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
  userId?: number;

  @ManyToOne(() => UserEntity, (user) => user.pantryItems)
  user?: User;

  @Column({ nullable: true })
  brandedItemName?: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.pantryItems)
  brand?: Brand;

  @Column({ type: 'bigint' })
  brandId?: number;

  @Column({ type: 'decimal' })
  quantity: number;

  @OneToOne(() => ProductEntity, (product) => product.id)
  product: Product;

  @Column({ type: 'bigint' })
  productId?: number;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  bestBeforeDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  manufacturedDate?: string;

  @Column({ type: 'timestamp', nullable: true })
  openedDate?: string;

  @Column({ type: 'decimal', default: 0 })
  millisecondsToExpiryAfterOpening?: number;

  @Column({ type: 'boolean', default: false })
  isExpired?: boolean;

  @Column({ type: 'boolean', default: false })
  canQuicklyExpireAfterOpening?: boolean;

  @Column({ type: 'decimal', default: 0 })
  numberOfServingsOrPieces?: number;

  @Column({ type: 'decimal', default: 0 })
  weightPerContainerOrPacket?: number;

  @Column({ type: 'enum', enum: Weights, default: Weights.GRAM })
  weightUnit?: Weights;

  @Column({ type: 'decimal', default: 0 })
  volumePerContainerOrPacket?: number;

  @Column({ type: 'enum', enum: Volumes, default: Volumes.MILLILITRE })
  volumeUnit?: Volumes;
}
