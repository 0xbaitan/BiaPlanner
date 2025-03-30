import { Module } from '@nestjs/common';
import { ShoppingItemEntity } from './shopping-item.entity';
import { ShoppingItemService } from './shopping-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingItemEntity])],
  providers: [ShoppingItemService],
  exports: [],
})
export class ShoppingItemModule {}
