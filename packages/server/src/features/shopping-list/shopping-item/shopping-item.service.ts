import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItemEntity } from './shopping-item.entity';
import {
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

  async manageShoppingItemsForShoppingList(
    shoppingListId: string,
    items: IWriteShoppingItemDto[],
  ): Promise<IShoppingItem[]> {
    const existingItems = await this.shoppingItemRepository.find({
      where: { shoppingListId },
      relations: ['product', 'replacement'],
    });

    const existingItemIds = existingItems.map((item) => item.id);

    // Find any existing items have been deleted as a result of the update
    const deletedItems = existingItems.filter(
      (item) => !items.some((i) => i.id === item.id),
    );

    // Delete any items that are no longer in the list
    for (const item of deletedItems) {
      await this.delete(item.id);
    }

    // Create or update items
    const shoppingItems = items.map((item) => {
      if (item.id && existingItemIds.includes(item.id)) {
        // Update existing item
        return this.updateWithListId(shoppingListId, item);
      }
      if (!item.id) {
        // Create new item
        return this.createWithListId(shoppingListId, item);
      }
    });

    return Promise.all(shoppingItems);
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

  async createWithListId(
    shoppingListId: string,
    dto: IWriteShoppingItemDto,
  ): Promise<IShoppingItem> {
    dto.shoppingListId = shoppingListId;

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

  async updateWithListId(
    shoppingListId: string,
    dto: IWriteShoppingItemDto,
  ): Promise<IShoppingItem> {
    dto.shoppingListId = shoppingListId;

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

    await this.shoppingItemRepository.update(dto.id, dto);

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
