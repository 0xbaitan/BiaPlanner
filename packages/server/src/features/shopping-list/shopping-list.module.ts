import { Module } from '@nestjs/common';
import { ShoppingListEntity } from './shopping-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListEntity])],
  exports: [],
})
export class ShoppingListModule {}
