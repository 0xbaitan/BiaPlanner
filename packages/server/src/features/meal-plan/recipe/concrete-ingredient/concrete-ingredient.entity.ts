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
  IConcreteIngredient,
  IConcreteRecipe,
  IPantryItem,
  IRecipeIngredient,
} from '@biaplanner/shared';

import { ConcreteRecipeEntity } from '../concrete-recipe/concrete-recipe.entity';
import { RecipeIngredientEntity } from '../recipe-ingredient/recipe-ingredient.entity';

@Entity('concrete-ingredients')
export class ConcreteIngredientEntity implements IConcreteIngredient {
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
  concreteRecipeId: string;

  @ManyToOne(
    () => ConcreteRecipeEntity,
    (recipe) => recipe.confirmedIngredients,
  )
  @JoinColumn({
    name: 'concreteRecipeId',
  })
  concreteRecipe: IConcreteRecipe;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  ingredientId: string;

  @OneToOne(() => RecipeIngredientEntity, {
    eager: true,
    cascade: true,
    onDelete: 'NO ACTION',
  })
  ingredient: IRecipeIngredient;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  pantryId: IPantryItem;

  @OneToOne(() => RecipeIngredientEntity, {
    eager: true,
    cascade: true,
    onDelete: 'NO ACTION',
  })
  pantryItem: IPantryItem;
}
