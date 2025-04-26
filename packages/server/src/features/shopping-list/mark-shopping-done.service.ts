import {
  IShoppingList,
  IUpdateShoppingItemDto,
  IUpdateShoppingItemExtendedDto,
  IShoppingItem,
  IUpdateShoppingListExtendedDto,
  ICreatePantryItemDto,
  IMarkShoppingListDoneDto,
  IWriteShoppingItemWithExpiryDto,
  IWriteShoppingItemExtendedDto,
} from '@biaplanner/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListEntity } from './shopping-list.entity';
import { Repository } from 'typeorm';
import PantryItemService from '../pantry/pantry-item/pantry-item.service';
import { Inject } from '@nestjs/common';

export class MarkShoppingDoneService {
  constructor(
    @InjectRepository(ShoppingListEntity)
    private shoppingListRepository: Repository<ShoppingListEntity>,
    @Inject(PantryItemService)
    private readonly pantryItemService: PantryItemService,
  ) {}

  private reshapeToCreatePantryItemDto(
    items: IWriteShoppingItemExtendedDto[],
  ): ICreatePantryItemDto[] {
    return items
      .map((item): ICreatePantryItemDto => {
        if (item.isCancelled) {
          return null;
        }

        if (item.isReplaced && !!item.replacement) {
          return {
            productId: item.replacement.productId,
            quantity: item.quantity,
            expiryDate: item.expiryDate,
          };
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          expiryDate: item.expiryDate,
        };
      })
      .filter((item) => !!item);
  }

  async markShoppingDone(
    dto: IMarkShoppingListDoneDto,
    createdById: string,
  ): Promise<IUpdateShoppingListExtendedDto> {
    const pantryItems: ICreatePantryItemDto[] =
      this.reshapeToCreatePantryItemDto(dto.items);

    const updatedShoppingList = await this.shoppingListRepository.save({
      ...dto,
      isShoppingComplete: true,
    });
    await Promise.all(
      pantryItems.map(async (item) => {
        const pantryItem = await this.pantryItemService.createPantryItem(
          item,
          createdById,
        );
        return pantryItem;
      }),
    );
    return updatedShoppingList;
  }
}
