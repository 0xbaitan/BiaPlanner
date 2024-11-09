import { Controller, Get, Inject, Query } from '@nestjs/common';
import PantryItemService from './pantry-item.service';
import { IPantryItem, PantryItem } from '@biaplanner/shared';
import { plainToInstance } from 'class-transformer';

@Controller('/pantry/items')
export default class PantryItemController {
  constructor(
    @Inject(PantryItemService) private pantryItemService: PantryItemService,
  ) {}

  @Get('/')
  async getAllPantryItems(
    @Query('userId') userId?: number,
  ): Promise<IPantryItem[]> {
    const pantryItems = await this.pantryItemService.readAllPantryItems(
      Number(userId),
    );

    return plainToInstance(PantryItem, pantryItems);
  }
}
