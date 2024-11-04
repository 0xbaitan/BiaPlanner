import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IProduct, ProductClassification } from '@biaplanner/shared';

import { ProductClassificationEntity } from './classification/product-classification.entity';

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
}
