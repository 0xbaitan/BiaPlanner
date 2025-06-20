import BrandModule from '../brand/brand.module';
import { ComputeExpiryDatesService } from './compute-expiry-dates.service';
import { Module } from '@nestjs/common';
import PantryItemController from './pantry-item.controller';
import { PantryItemEntity } from './pantry-item.entity';
import { PantryItemPortionModule } from '@/features/meal-plan/recipe/pantry-item-portion/pantry-item-portion.module';
import PantryItemService from './pantry-item.service';
import ProductCategoryModule from '../product/category/product-category.module';
import ProductModule from '../product/product.module';
import { QueryPantryItemController } from './query-pantry-item.controller';
import { QueryPantryItemService } from './query-pantry-item.service';
import { RecipeIngredientModule } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.module';
import { ShelfLifePantryItemController } from './shelf-line.pantry-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PantryItemEntity]),
    ProductCategoryModule,
    ProductModule,
    RecipeIngredientModule,
  ],
  controllers: [
    PantryItemController,
    ShelfLifePantryItemController,
    QueryPantryItemController,
  ],
  providers: [
    PantryItemService,
    ComputeExpiryDatesService,
    QueryPantryItemService,
  ],
  exports: [PantryItemService, ComputeExpiryDatesService],
})
export default class PantryItemModule {}
