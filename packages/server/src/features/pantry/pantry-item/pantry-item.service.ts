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

  async createPantryItem(
    dto: ICreatePantryItemDto,
    createdById: string,
  ): Promise<IPantryItem> {
    const pantryItem = this.pantryItemRepository.create({
      ...dto,
      createdById,
    });
    return await this.pantryItemRepository.save(pantryItem);
  }

  async findAllPantryItems(createdById: string): Promise<IPantryItem[]> {
    const userScopedPantryItems = await this.pantryItemRepository.find({
      where: { createdById },
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
