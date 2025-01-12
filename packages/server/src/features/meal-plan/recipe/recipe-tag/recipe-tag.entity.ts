import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IRecipe, IRecipeTag } from '@biaplanner/shared';

import { RecipeEntity } from '../recipe.entity';

@Entity('recipe_tags')
export class RecipeTagEntity implements IRecipeTag {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @ManyToMany(() => RecipeEntity, (recipe) => recipe.tags)
  recipes?: IRecipe[];
}
