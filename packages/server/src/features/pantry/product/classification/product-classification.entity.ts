import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IProductClassification, Product } from '@biaplanner/shared';

import { ProductEntity } from '../product.entity';

@Entity('product-classifications')
export class ProductClassificationEntity implements IProductClassification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  classificationName: string;

  @OneToMany(() => ProductEntity, (product) => product.productClassification)
  @JoinColumn({ name: 'productClassificationId' })
  products?: Product[];
}
