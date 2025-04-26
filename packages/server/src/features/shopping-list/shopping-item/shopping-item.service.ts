import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItemEntity } from './shopping-item.entity';
import {
  ICreateShoppingItemDto,
  IShoppingItem,
  IWriteShoppingItemDto,
  IWriteShoppingItemExtendedDto,
} from '@biaplanner/shared';

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

  async create(dto: IWriteShoppingItemExtendedDto): Promise<IShoppingItem> {
    const shoppingItem = this.shoppingItemRepository.create(dto);
    const result = await this.shoppingItemRepository.insert(shoppingItem);
    if (result.identifiers.length === 0) {
      const errorMessage = `Failed to create shopping item.`;
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
    return this.shoppingItemRepository.findOneOrFail({
      where: { id: result.identifiers[0].id },
      relations: ['product', 'replacement'],
    });
  }

  async update(
    shoppingListId: string,
    dto: IWriteShoppingItemDto,
  ): Promise<IShoppingItem> {
    if (!dto.id) {
      const errorMessage = `Shopping item ID is required for updating an item.`;
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    const isShoppingItemExisting = await this.shoppingItemRepository.exists({
      where: { shoppingListId },
    });

    if (!isShoppingItemExisting) {
      console.error(`Shopping item with ID ${shoppingListId} does not exist.`);
      throw new BadRequestException(
        `Shopping item with shopping list ID ${shoppingListId} does not exist.`,
      );
    }

    const result = await this.shoppingItemRepository.update(dto.id, dto);

    return this.shoppingItemRepository.findOneOrFail({
      where: { id: dto.id },
      relations: ['product', 'replacement'],
    });
  }

  async delete(id: string): Promise<void> {
    const shoppingItemExists = await this.shoppingItemRepository.exists({
      where: { id },
    });
    if (!shoppingItemExists) {
      const errorMessage = `Shopping item with ID ${id} does not exist.`;
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
    const result = await this.shoppingItemRepository.softDelete(id);
    if (result.affected === 0) {
      const errorMessage = `Failed to delete shopping item with ID ${id}.`;
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
  }
}
