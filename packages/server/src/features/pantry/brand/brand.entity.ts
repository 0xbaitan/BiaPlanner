import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBrand, IProduct } from '@biaplanner/shared';

import { ProductEntity } from '../product/product.entity';

@Entity('brands')
export class BrandEntity implements IBrand {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  @JoinColumn({ name: 'brandId' })
  products?: IProduct[];

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
