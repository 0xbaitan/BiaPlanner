import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { PantryItemPortionEntity } from './pantry-item-portion.entity';

import PantryItemService from '@/features/pantry/pantry-item/pantry-item.service';
import {
  IWritePantryItemDto,
  IWritePantryItemPortionDto,
} from '@biaplanner/shared';

@Injectable()
export class PantryItemPortionService {
  constructor(
    @InjectRepository(PantryItemPortionEntity)
    private pantryItemPortionRepository: Repository<PantryItemPortionEntity>,

    @Inject(PantryItemService) private pantryItemService: PantryItemService,
  ) {}

  async create(dto: IWritePantryItemPortionDto) {
    let pantryItemPortion = this.pantryItemPortionRepository.create(dto);
    pantryItemPortion =
      await this.pantryItemPortionRepository.save(pantryItemPortion);
    await this.pantryItemService.reservePortion(pantryItemPortion);
    return pantryItemPortion;
  }
}
