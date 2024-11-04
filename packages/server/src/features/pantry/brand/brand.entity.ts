import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IBrand, PantryItem } from '@biaplanner/shared';

import { PantryItemEntity } from '../pantry-item/pantry-item.entity';

@Entity('brands')
export class BrandEntity implements IBrand {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  brandName: string;

  @OneToMany(() => PantryItemEntity, (pantryItem) => pantryItem.brand)
  @JoinColumn({ name: 'brandId' })
  pantryItems?: PantryItem[];
}
