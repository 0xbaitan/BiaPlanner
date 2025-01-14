import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConcreteRecipeEntity])],
  providers: [],
  exports: [],
})
export class ConcretRecipeModule {}
