import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  DifficultyLevels,
  ICuisine,
  IRecipe,
  IRecipeIngredient,
  IRecipeTag,
  SegmentedTime,
  Time,
} from '@biaplanner/shared';

import { CuisineEntity } from '../cuisine/cuisine.entity';
import { RecipeIngredientEntity } from './recipe-ingredient/recipe-ingredient.entity';
import { RecipeTagEntity } from './recipe-tag/recipe-tag.entity';

@Entity('recipes')
export class RecipeEntity implements IRecipe {
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
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.recipe,
    {
      cascade: true,
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  ingredients: IRecipeIngredient[];

  @Column({
    type: 'enum',
    enum: DifficultyLevels,
    nullable: false,
  })
  difficultyLevel: DifficultyLevels;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  cuisineId: string;

  @ManyToOne(() => CuisineEntity, (cuisine) => cuisine.recipes, {
    eager: true,
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'cuisineId',
  })
  cuisine: ICuisine;

  @Column({
    type: 'json',
  })
  cookingTime?: SegmentedTime;

  @Column({
    type: 'json',
  })
  prepTime?: SegmentedTime;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  defaultNumberOfServings?: [number, number];

  @Column({
    type: 'text',
    nullable: false,
  })
  instructions: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  source?: string;

  @ManyToMany(() => RecipeTagEntity, (tag) => tag.recipes, {
    cascade: true,
    onDelete: 'NO ACTION',
    eager: true,
  })
  @JoinTable({
    name: 'recipes_recipe_tags',
    joinColumn: { name: 'recipeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags?: IRecipeTag[];
}
