import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IProductCategory, Product } from '@biaplanner/shared';

import { ProductEntity } from '../product.entity';

@Entity('product-categories')
export class ProductCategoryEntity implements IProductCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @ManyToMany(() => ProductEntity, (product) => product.productCategories)
  products?: Product[];
}
