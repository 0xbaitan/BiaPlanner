import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { Repository } from 'typeorm';

import { ConcreteIngredientService } from '../concrete-ingredient/concrete-ingredient.service';
import { IWriteConcreteRecipeDto } from '@biaplanner/shared';

@Injectable()
export class ConcreteRecipeService {
  constructor(
    @InjectRepository(ConcreteRecipeEntity)
    private readonly concreteRecipeRepository: Repository<ConcreteRecipeEntity>,
    @Inject(ConcreteIngredientService)
    private readonly concreteIngredientService: ConcreteIngredientService,
  ) {}

  async findOne(id: string) {
    return this.concreteRecipeRepository.findOneOrFail({
      where: { id },
      relations: [
        'recipe',
        'confirmedIngredients',
        'confirmedIngredients.ingredient',
        'confirmedIngredients.pantryItemsWithPortions',
        'confirmedIngredients.pantryItemsWithPortions.pantryItem',
        'confirmedIngredients.pantryItemsWithPortions.pantryItem.product',
      ],
    });
  }

  async findAll() {
    return this.concreteRecipeRepository.find({
      relations: ['recipe'],
    });
  }

  async create(dto: IWriteConcreteRecipeDto) {
    const concreteRecipe = this.concreteRecipeRepository.create(dto);
    return this.concreteRecipeRepository.save(concreteRecipe);
  }
}
