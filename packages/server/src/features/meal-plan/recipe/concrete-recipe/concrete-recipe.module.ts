import { ConcreteIngredientModule } from '../concrete-ingredient/concrete-ingredient.module';
import { ConcreteRecipeController } from './concrete-recipe.controller';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { ConcreteRecipeService } from './concrete-recipe.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcreteRecipeEntity]),
    ConcreteIngredientModule,
  ],
  controllers: [ConcreteRecipeController],
  providers: [ConcreteRecipeService],
  exports: [ConcreteRecipeService],
})
export class ConcretRecipeModule {}
