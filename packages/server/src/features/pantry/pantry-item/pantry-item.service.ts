import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import { Between, Repository } from 'typeorm';
import {
  CreatePantryItemDto,
  ICreatePantryItemDto,
  IPantryItem,
} from '@biaplanner/shared';

@Injectable()
export default class PantryItemService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private pantryItemRepository: Repository<PantryItemEntity>,
  ) {}

  async createPantryItem(dto: ICreatePantryItemDto) {
    const pantryItem = this.pantryItemRepository.create(dto);
    return await this.pantryItemRepository.save(pantryItem);
  }

  async readAllPantryItems(userId?: number): Promise<IPantryItem[]> {
    if (!userId) {
      const allPantryItems = this.pantryItemRepository.find({
        relations: [
          'createdBy',
          'product',
          'product.brand',
          'product.productCategories',
        ],
      });
      return allPantryItems;
    }
    const userScopedPantryItems = await this.pantryItemRepository.find({
      where: { createdById: userId },
      relations: [
        'createdBy',
        'product',
        'product.brand',
        'product.productCategories',
      ],
    });
    return userScopedPantryItems;
  }
}
