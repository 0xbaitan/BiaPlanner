import {
  Brand,
  IProduct,
  MeasurementMetric,
  PantryItem,
  ProductCategory,
  User,
  Volumes,
  Weights,
} from '@biaplanner/shared';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BrandEntity } from '../brand/brand.entity';
import { PantryItemEntity } from '../pantry-item/pantry-item.entity';
import { ProductCategoryEntity } from './category/product-category.entity';
import { UserEntity } from 'src/features/user-info/user/user.entity';

@Entity('products')
export class ProductEntity implements IProduct {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @ManyToMany(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.products,
  )
  @JoinTable()
  productCategories?: ProductCategory[];

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brand?: Brand;

  @Column({ type: 'bigint' })
  brandId?: number;

  @Column({ type: 'boolean', default: false })
  canQuicklyExpireAfterOpening?: boolean;

  @Column({ type: 'integer', nullable: true })
  millisecondsToExpiryAfterOpening?: number;

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.product, {
    cascade: true,
  })
  @JoinColumn({ name: 'productId' })
  pantryItems?: PantryItem[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  createdBy?: User;

  @Column({ type: 'bigint', nullable: true })
  createdById?: number;

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
  useMeasurementMetric?: MeasurementMetric;

  @Column({ type: 'integer', nullable: true })
  volumePerContainerOrPacket?: number;

  @Column({ type: 'enum', enum: Volumes, nullable: true })
  volumeUnit?: Volumes;

  @Column({ type: 'integer', nullable: true })
  weightPerContainerOrPacket?: number;

  @Column({ type: 'enum', enum: Weights, nullable: true })
  weightUnit?: Weights;
}
