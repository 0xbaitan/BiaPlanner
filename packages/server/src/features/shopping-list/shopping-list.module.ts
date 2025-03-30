import { Module } from '@nestjs/common';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { ShoppingListEntity } from './shopping-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListEntity]), ShoppingItemModule],
  exports: [],
})
export class ShoppingListModule {}
