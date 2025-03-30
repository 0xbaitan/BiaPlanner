import { Module } from '@nestjs/common';
import { ShoppingItemEntity } from './shopping-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingItemEntity])],
  exports: [],
})
export class ShoppingItemModule {}
