import {
  Approximates,
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
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'enum',
    enum: Volumes,
    nullable: true,
  })
  volumeUnit: Volumes | null;

  @Column({
    type: 'enum',
    enum: Weights,
    nullable: true,
  })
  weightUnit: Weights | null;

  @Column({
    type: 'enum',
    enum: Approximates,
    nullable: true,
  })
  approximateUnit: Approximates | null;

  @Column({
    type: 'bigint',
  })
  recipeId?: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients)
  @JoinColumn({ name: 'recipeId' })
  recipe?: IRecipe;
}
