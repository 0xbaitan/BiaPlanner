import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { Repository } from 'typeorm';
import { ICreateConcreteRecipeDto } from '@biaplanner/shared';
import { ConcreteIngredientService } from '../concrete-ingredient/concrete-ingredient.service';

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
      relations: ['recipe', 'confirmedIngredients'],
    });
  }

  async findAll() {
    return this.concreteRecipeRepository.find({
      relations: ['recipe', 'confirmedIngredients'],
    });
  }

  async create(dto: ICreateConcreteRecipeDto) {
    const concreteIngredients = await Promise.all(
      dto.confirmedIngredients.map((ingredient) =>
        this.concreteIngredientService.create(ingredient),
      ),
    );
    const concreteRecipe = this.concreteRecipeRepository.create(dto);
    concreteRecipe.confirmedIngredients = concreteIngredients;
    return this.concreteRecipeRepository.save(concreteRecipe);
  }
}
