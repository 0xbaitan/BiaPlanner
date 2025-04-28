import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import PantryItemService from './pantry-item.service';
import {
  CookingMeasurementType,
  IPantryItem,
  IPantryItemExtended,
  IUser,
  IWritePantryItemDto,
  WritePantryItemSchema,
} from '@biaplanner/shared';
import { User } from 'src/features/user-info/authentication/user.decorator';

import { ZodValidationPipe } from 'nestjs-zod';

const WritePantryItemValidationPipe = new ZodValidationPipe(
  WritePantryItemSchema,
);

@Controller('/pantry/items')
export default class PantryItemController {
  constructor(
    @Inject(PantryItemService) private pantryItemService: PantryItemService,
  ) {}

  @Get('/')
  async findAllPantryItems(
    @User() { id: createdById }: IUser,
  ): Promise<IPantryItem[]> {
    const pantryItems =
      await this.pantryItemService.findAllPantryItems(createdById);

    return pantryItems;
  }

  @Get('/group')
  async findPantryItemsByIds(
    @Query('pantryItemIds') pantryItemIds: string[],
  ): Promise<IPantryItem[]> {
    const pantryItems =
      await this.pantryItemService.findPantryItemsByIds(pantryItemIds);

    return pantryItems;
  }

  @Post('/')
  async createPantryItem(
    @Body(WritePantryItemValidationPipe) dto: IWritePantryItemDto,
    @User() { id: createdById }: IUser,
  ): Promise<IPantryItem> {
    const pantryItem = await this.pantryItemService.createPantryItem(
      dto,
      createdById,
    );
    return pantryItem;
  }

  @Get('/compatible')
  async findIngredientCompatiblePantryItems(
    @Query('measurementType') measurementType: CookingMeasurementType,
    @Query('ingredientId') ingredientId: string,
  ): Promise<IPantryItemExtended[]> {
    const pantryItems =
      await this.pantryItemService.findIngredientCompatiblePantryItems(
        ingredientId,

        measurementType,
      );

    return pantryItems;
  }
}
