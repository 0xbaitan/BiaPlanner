import { Module } from '@nestjs/common';
import { RecipeTagController } from './recipe-tag.controller';
import { RecipeTagEntity } from './recipe-tag.entity';
import { RecipeTagHelperService } from './recipe-tag-helper.service';
import { RecipeTagService } from './recipe-tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeTagEntity])],
  controllers: [RecipeTagController],
  providers: [RecipeTagService, RecipeTagHelperService],
  exports: [RecipeTagService, RecipeTagHelperService],
})
export class RecipeTagModule {}
