import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CookingMeasurement,
  IConcreteIngredient,
  IPantryItem,
  IPantryItemPortion,
} from '@biaplanner/shared';

import { ConcreteIngredientEntity } from '../concrete-ingredient/concrete-ingredient.entity';
import { PantryItemEntity } from '@/features/pantry/pantry-item/pantry-item.entity';

@Entity()
export class PantryItemPortionEntity implements IPantryItemPortion {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

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

  @Column({
    type: 'bigint',
    nullable: false,
  })
  pantryItemId: string;

  @OneToOne(() => PantryItemEntity)
  @JoinColumn({
    name: 'pantryItemId',
    referencedColumnName: 'id',
  })
  pantryItem: IPantryItem;

  @Column({
    type: 'json',
    nullable: true,
  })
  portion?: CookingMeasurement;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  concreteIngredientId?: string;

  @ManyToOne(
    () => ConcreteIngredientEntity,
    (concreteIngredient) => concreteIngredient.pantryItemsWithPortions,
  )
  @JoinColumn({
    name: 'concreteIngredientId',
    referencedColumnName: 'id',
  })
  concreteIngredient?: IConcreteIngredient;
}
