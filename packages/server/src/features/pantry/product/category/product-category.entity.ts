import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IProduct,
  IProductCategory,
  IRecipeIngredient,
} from '@biaplanner/shared';

import { ProductEntity } from '../product.entity';
import { RecipeIngredientEntity } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.entity';

@Entity('product-categories')
export class ProductCategoryEntity implements IProductCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @ManyToMany(() => ProductEntity, (product) => product.productCategories)
  products?: IProduct[];

  @Column({ type: 'boolean', default: false, nullable: false })
  isAllergen?: boolean;

  @ManyToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.productCategories,
  )
  recipeIngredients?: IRecipeIngredient[];

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
