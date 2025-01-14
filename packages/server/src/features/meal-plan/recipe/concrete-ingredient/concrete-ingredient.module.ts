import { ConcreteIngredientEntity } from './concrete-ingredient.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConcreteIngredientEntity])],
  providers: [],
  exports: [],
})
export class ConcreteIngredientModule {}
