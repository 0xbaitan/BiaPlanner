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
  CookingMeasurement,
  IBrand,
  IPantryItem,
  IProduct,
  IProductCategory,
  IUser,
  TimeMeasurement,
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

  @Column({
    type: 'json',
    default: null,
  })
  measurement: CookingMeasurement;

  @Column({
    type: 'json',
    default: null,
  })
  timeTillExpiryAfterOpening?: TimeMeasurement;

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
