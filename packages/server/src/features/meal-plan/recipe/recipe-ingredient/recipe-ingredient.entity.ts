import {
  Approximates,
  CookingMeasurement,
  CookingMeasurementUnit,
  IProductCategory,
  IRecipe,
  IRecipeIngredient,
  Volumes,
  Weights,
} from '@biaplanner/shared';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductCategoryEntity } from 'src/features/pantry/product/category/product-category.entity';
import { RecipeEntity } from '../recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredientEntity implements IRecipeIngredient {
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
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  title?: string;

  @ManyToMany(() => ProductCategoryEntity, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'recipe_ingredients_product_categories',
    joinColumn: {
      name: 'recipeIngredientId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productCategoryId',
      referencedColumnName: 'id',
    },
  })
  productCategories: IProductCategory[];

  @Column({
    type: 'json',
    nullable: true,
  })
  measurement?: CookingMeasurement;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  recipeId?: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients)
  @JoinColumn({ name: 'recipeId' })
  recipe?: IRecipe;
}
