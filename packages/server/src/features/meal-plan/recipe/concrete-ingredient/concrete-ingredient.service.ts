import {
  IConcreteIngredient,
  IWriteConcreteIngredientDto,
} from '@biaplanner/shared';

import { Inject, Injectable } from '@nestjs/common';
import { PantryItemPortionService } from '../pantry-item-portion/pantry-item-portion.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcreteIngredientEntity } from './concrete-ingredient.entity';

@Injectable()
export class ConcreteIngredientService {
  constructor(
    @InjectRepository(ConcreteIngredientEntity)
    private readonly concreteIngredientRepository: Repository<ConcreteIngredientEntity>,
    @Inject(PantryItemPortionService)
    private readonly pantryItemPortionService: PantryItemPortionService,
  ) {}

  async create(dto: IWriteConcreteIngredientDto) {
    const pantryItemPortions = await Promise.all(
      dto.pantryItemsWithPortions.map((pantryItemWithPortion) =>
        this.pantryItemPortionService.create(pantryItemWithPortion),
      ),
    );
    const concreteIngredient = this.concreteIngredientRepository.create(dto);
    concreteIngredient.pantryItemsWithPortions = pantryItemPortions;
    return this.concreteIngredientRepository.save(concreteIngredient);
  }
}
