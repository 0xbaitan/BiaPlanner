import { Module } from '@nestjs/common';
import { QueryRecipeTagController } from './query-recipe-tag.controller';
import { QueryRecipeTagService } from './query-recipe-tag.service';
import { RecipeTagController } from './recipe-tag.controller';
import { RecipeTagEntity } from './recipe-tag.entity';
import { RecipeTagHelperService } from './recipe-tag-helper.service';
import { RecipeTagService } from './recipe-tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeTagEntity])],
  controllers: [RecipeTagController, QueryRecipeTagController],
  providers: [RecipeTagService, RecipeTagHelperService, QueryRecipeTagService],
  exports: [RecipeTagService, RecipeTagHelperService],
})
export class RecipeTagModule {}
