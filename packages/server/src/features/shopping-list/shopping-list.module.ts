import { Module } from '@nestjs/common';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListEntity } from './shopping-list.entity';
import { ShoppingListService } from './shopping-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListEntity]), ShoppingItemModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
  exports: [],
})
export class ShoppingListModule {}
