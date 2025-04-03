import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItemEntity } from './shopping-item.entity';
import { ICreateShoppingItemDto } from '@biaplanner/shared';

@Injectable()
export class ShoppingItemService {
  constructor(
    @InjectRepository(ShoppingItemEntity)
    private readonly shoppingItemRepository: Repository<ShoppingItemEntity>,
  ) {}

  async findAll(): Promise<ShoppingItemEntity[]> {
    return this.shoppingItemRepository.find({
      relations: ['product', 'replacement'],
    });
  }

  async findOne(id: string): Promise<ShoppingItemEntity> {
    return this.shoppingItemRepository.findOneOrFail({
      where: { id },
      relations: ['product', 'replacement'],
    });
  }

  async create(dto: ICreateShoppingItemDto): Promise<ShoppingItemEntity> {
    const shoppingItem = this.shoppingItemRepository.create(dto);
    return this.shoppingItemRepository.save(shoppingItem);
  }

  async update(
    id: string,
    dto: Partial<ShoppingItemEntity>,
  ): Promise<ShoppingItemEntity> {
    await this.shoppingItemRepository.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const shoppingItem = await this.findOne(id);
    await this.shoppingItemRepository.softDelete(shoppingItem.id);
  }
}
