import { MarkShoppingDoneController } from './mark-shopping-done.controller';
import { MarkShoppingDoneService } from './mark-shopping-done.service';
import { Module } from '@nestjs/common';
import PantryItemModule from '../pantry/pantry-item/pantry-item.module';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListEntity } from './shopping-list.entity';
import { ShoppingListService } from './shopping-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingListEntity]),
    ShoppingItemModule,
    PantryItemModule,
  ],
  controllers: [ShoppingListController, MarkShoppingDoneController],
  providers: [ShoppingListService, MarkShoppingDoneService],
  exports: [],
})
export class ShoppingListModule {}
