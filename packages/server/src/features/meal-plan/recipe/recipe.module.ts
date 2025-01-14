import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeIngredientModule } from './recipe-ingredient/recipe-ingredient.module';
import { RecipeService } from './recipe.service';
import { RecipeTagModule } from './recipe-tag/recipe-tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    RecipeTagModule,
    RecipeIngredientModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
