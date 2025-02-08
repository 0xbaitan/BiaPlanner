import BrandModule from '../brand/brand.module';
import { Module } from '@nestjs/common';
import PantryItemController from './pantry-item.controller';
import { PantryItemEntity } from './pantry-item.entity';
import PantryItemService from './pantry-item.service';
import ProductCategoryModule from '../product/category/product-category.module';
import ProductModule from '../product/product.module';
import { RecipeIngredientModule } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PantryItemEntity]),
    ProductCategoryModule,
    ProductModule,
    RecipeIngredientModule,
  ],
  controllers: [PantryItemController],
  providers: [PantryItemService],
  exports: [TypeOrmModule],
})
export default class PantryItemModule {}
