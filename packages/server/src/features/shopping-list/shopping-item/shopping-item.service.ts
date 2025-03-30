import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItemEntity } from './shopping-item.entity';

@Injectable()
export class ShoppingItemService {
  constructor(
    @InjectRepository(ShoppingItemEntity)
    private readonly shoppingItemRepository: Repository<ShoppingItemEntity>,
  ) {}

  async findAll(): Promise<ShoppingItemEntity[]> {
    return this.shoppingItemRepository.find({});
  }

  async findOne(id: string): Promise<ShoppingItemEntity> {
    return this.shoppingItemRepository.findOne({ where: { id } });
  }
}
