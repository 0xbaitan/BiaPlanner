import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IConcreteIngredient,
  IConcreteRecipe,
  IRecipe,
  MealTypes,
} from '@biaplanner/shared';

import { ConcreteIngredientEntity } from '../concrete-ingredient/concrete-ingredient.entity';
import { RecipeEntity } from '../recipe.entity';

@Entity('concrete-recipes')
export class ConcreteRecipeEntity implements IConcreteRecipe {
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
  recipeId: string;

  @ManyToOne(() => RecipeEntity)
  @JoinColumn({
    name: 'recipeId',
  })
  recipe: IRecipe;

  @OneToMany(
    () => ConcreteIngredientEntity,
    (ingredient) => ingredient.concreteRecipe,
    {
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  confirmedIngredients: IConcreteIngredient[];

  @Column({
    type: 'enum',
    enum: MealTypes,
  })
  mealType: MealTypes;

  @Column({
    type: 'json',
    nullable: true,
  })
  numberOfServings?: [number, number];

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  planDate?: string;

  @Column({
    type: 'tinyint',
    default: 0,
    nullable: false,
    transformer: {
      from: (value: number) => Boolean(value),
      to: (value: boolean) => Number(value),
    },
  })
  isSufficient: boolean;

  @Column({
    type: 'tinyint',
    default: 0,
    nullable: false,
    transformer: {
      from: (value: number) => Boolean(value),
      to: (value: boolean) => Number(value),
    },
  })
  isCooked: boolean;
}
