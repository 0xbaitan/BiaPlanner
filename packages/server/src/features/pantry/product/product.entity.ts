import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IBrand,
  IPantryItem,
  IProduct,
  IProductCategory,
  IUser,
  Volumes,
  Weights,
} from '@biaplanner/shared';

import { BrandEntity } from '../brand/brand.entity';
import { PantryItemEntity } from '../pantry-item/pantry-item.entity';
import { ProductCategoryEntity } from './category/product-category.entity';
import { UserEntity } from 'src/features/user-info/user/user.entity';

@Entity('products')
export class ProductEntity implements IProduct {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @ManyToMany(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.products,
    {
      eager: true,
      cascade: ['insert', 'update'],
    },
  )
  @JoinTable({
    name: 'products_product-categories',
    joinColumn: { name: 'productId' },
    inverseJoinColumn: {
      name: 'productCategoryId',
    },
  })
  productCategories?: IProductCategory[];

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brand?: IBrand;

  @Column({ type: 'bigint' })
  brandId?: string;

  @Column({ type: 'boolean', default: false })
  canQuicklyExpireAfterOpening?: boolean;

  @Column({ type: 'integer', nullable: true })
  millisecondsToExpiryAfterOpening?: number;

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.product, {
    cascade: true,
  })
  @JoinColumn({ name: 'productId' })
  pantryItems?: IPantryItem[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  createdBy?: IUser;

  @Column({ type: 'bigint', nullable: true })
  createdById?: string;

  @Column({ type: 'boolean', default: false })
  isGlobal?: boolean;

  @Column({ type: 'boolean', default: false })
  canExpire?: boolean;

  @Column({ type: 'boolean', default: false })
  isLoose?: boolean;

  @Column({ type: 'integer', nullable: true, scale: 0 })
  numberOfServingsOrPieces?: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  useMeasurementMetric?: 'weight' | 'volume';

  @Column({ type: 'integer', nullable: true })
  volumePerContainerOrPacket?: number;

  @Column({ type: 'enum', enum: Volumes, nullable: true })
  volumeUnit?: Volumes;

  @Column({ type: 'integer', nullable: true })
  weightPerContainerOrPacket?: number;

  @Column({ type: 'enum', enum: Weights, nullable: true })
  weightUnit?: Weights;

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
