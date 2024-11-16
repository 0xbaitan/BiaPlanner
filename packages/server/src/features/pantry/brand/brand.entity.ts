import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IBrand, PantryItem, Product } from '@biaplanner/shared';

import { PantryItemEntity } from '../pantry-item/pantry-item.entity';
import { ProductEntity } from '../product/product.entity';

@Entity('brands')
export class BrandEntity implements IBrand {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  @JoinColumn({ name: 'brandId' })
  products?: Product[];
}
