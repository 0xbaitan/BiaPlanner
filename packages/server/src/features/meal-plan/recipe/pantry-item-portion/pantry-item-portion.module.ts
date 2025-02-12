import { Module } from '@nestjs/common';
import { PantryItemPortionEntity } from './pantry-item-portion.entity';
import { PantryItemPortionService } from './pantry-item-portion.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PantryItemPortionEntity])],
  controllers: [],
  providers: [PantryItemPortionService],
  exports: [PantryItemPortionService],
})
export class PantryItemPortionModule {}
