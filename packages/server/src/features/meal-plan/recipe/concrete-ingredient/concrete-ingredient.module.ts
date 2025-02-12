import { ConcreteIngredientEntity } from './concrete-ingredient.entity';
import { ConcreteIngredientService } from './concrete-ingredient.service';
import { Module } from '@nestjs/common';
import { PantryItemPortionModule } from '../pantry-item-portion/pantry-item-portion.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcreteIngredientEntity]),
    PantryItemPortionModule,
  ],
  providers: [ConcreteIngredientService],
  exports: [ConcreteIngredientService],
})
export class ConcreteIngredientModule {}
