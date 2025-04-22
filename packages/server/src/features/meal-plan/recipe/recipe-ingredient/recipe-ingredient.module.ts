import { Module } from '@nestjs/common';
import { RecipeIngredientController } from './recipe-ingredient.controller';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { RecipeIngredientHelperService } from './recipe-ingredient-helper.service';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredientEntity])],
  controllers: [RecipeIngredientController],
  providers: [RecipeIngredientService, RecipeIngredientHelperService],
  exports: [RecipeIngredientService, RecipeIngredientHelperService],
})
export class RecipeIngredientModule {}
