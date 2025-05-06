import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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
  CookingMeasurementType,
  IBrand,
  IFile,
  IPantryItem,
  IProduct,
  IProductCategory,
  IShoppingItem,
  IUser,
  TimeMeasurement,
  Volumes,
  Weights,
} from '@biaplanner/shared';

import { BrandEntity } from '../brand/brand.entity';
import { FileEntity } from '@/features/files/file.entity';
import { PantryItemEntity } from '../pantry-item/pantry-item.entity';
import { ProductCategoryEntity } from './category/product-category.entity';
import { ShoppingItemEntity } from '@/features/shopping-list/shopping-item/shopping-item.entity';
import { UserEntity } from 'src/features/user-info/user/user.entity';

export enum ProductEntityIndices {
  PRODUCT_FULL_TEXT_FIELDS_IDX = 'product_full_text_fields_idx',
}

@Index(
  ProductEntityIndices.PRODUCT_FULL_TEXT_FIELDS_IDX,
  ['name', 'description'],
  {
    fulltext: true,
  },
)
@Entity('products')
export class ProductEntity implements IProduct {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

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
    joinColumn: { name: 'productId', referencedColumnName: 'id' },

    inverseJoinColumn: {
      name: 'productCategoryId',
      referencedColumnName: 'id',
    },
  })
  productCategories?: IProductCategory[];

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brand?: IBrand;

  @Column({ type: 'bigint' })
  brandId?: string;

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.product, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'productId' })
  pantryItems?: IPantryItem[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  createdBy?: IUser;

  @Column({ type: 'bigint', nullable: true })
  createdById?: string;

  @Column({ type: 'boolean', default: false })
  isGlobal?: boolean;

  @Column({
    type: 'tinyint',
    default: false,
    transformer: {
      from: (value: number) => Boolean(value),
      to: (value: boolean) => Number(value),
    },
  })
  canExpire?: boolean;

  @Column({
    type: 'tinyint',
    default: false,
    transformer: {
      from: (value: number) => Boolean(value),
      to: (value: boolean) => Number(value),
    },
  })
  isLoose?: boolean;

  @Column({
    type: 'simple-json',
    default: null,
  })
  measurement: CookingMeasurement;

  @Column({
    type: 'enum',
    enum: CookingMeasurementType,
    nullable: true,
  })
  measurementType?: CookingMeasurementType;

  @Column({ type: 'bigint', nullable: true })
  coverId?: string;

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coverId' })
  cover?: IFile;

  @OneToMany(() => ShoppingItemEntity, (shoppingItem) => shoppingItem.product)
  @JoinColumn({ name: 'productId' })
  shoppingItems?: IShoppingItem[];

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
