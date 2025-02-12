import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { PantryItemPortionEntity } from './pantry-item-portion.entity';
import { ICreatePantryItemPortionDto } from '@biaplanner/shared';

@Injectable()
export class PantryItemPortionService {
  constructor(
    @InjectRepository(PantryItemPortionEntity)
    private pantryItemPortionRepository: Repository<PantryItemPortionEntity>,
  ) {}

  async create(dto: ICreatePantryItemPortionDto) {
    const pantryItemPortion = this.pantryItemPortionRepository.create(dto);
    return this.pantryItemPortionRepository.save(pantryItemPortion);
  }
}
