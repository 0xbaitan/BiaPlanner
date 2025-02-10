import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import PantryItemService from './pantry-item.service';
import {
  CookingMeasurementType,
  CreatePantryItemDto,
  IPantryItem,
  IPantryItemExtended,
  IUser,
} from '@biaplanner/shared';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/features/user-info/authentication/user.decorator';

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

  @Post('/')
  async createPantryItem(
    @Body() dto: CreatePantryItemDto,
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
