import { ConcreteIngredientModule } from '../concrete-ingredient/concrete-ingredient.module';
import { ConcreteRecipeController } from './concrete-recipe.controller';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { ConcreteRecipeService } from './concrete-recipe.service';
import { Module } from '@nestjs/common';
import PantryModule from '@/features/pantry/pantry.module';
import { QueryConcreteRecipeController } from './query-concrete-recipe.controller';
import { QueryConcreteRecipeService } from './query-concrete-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcreteRecipeEntity]),
    ConcreteIngredientModule,
    PantryModule,
  ],
  controllers: [ConcreteRecipeController, QueryConcreteRecipeController],
  providers: [ConcreteRecipeService, QueryConcreteRecipeService],
  exports: [ConcreteRecipeService],
})
export class ConcretRecipeModule {}
