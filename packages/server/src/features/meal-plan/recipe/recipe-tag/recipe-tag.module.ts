import { Module } from '@nestjs/common';
import { RecipeTagController } from './recipe-tag.controller';
import { RecipeTagEntity } from './recipe-tag.entity';
import { RecipeTagService } from './recipe-tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeTagEntity])],
  controllers: [RecipeTagController],
  providers: [RecipeTagService],
  exports: [RecipeTagService],
})
export class RecipeTagModule {}
