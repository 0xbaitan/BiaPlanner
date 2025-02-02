import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConcreteRecipeService {
  constructor(
    @InjectRepository(ConcreteRecipeEntity)
    private readonly concreteRecipeRepository: Repository<ConcreteRecipeEntity>,
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

  
}
