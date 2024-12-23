import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import PantryItemService from './pantry-item.service';
import {
  CreatePantryItemDto,
  IPantryItem,
  PantryItem,
} from '@biaplanner/shared';
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

  @Post('/')
  async createPantryItem(
    @Body() dto: CreatePantryItemDto,
  ): Promise<IPantryItem> {
    const pantryItem = await this.pantryItemService.createPantryItem(dto);
    return plainToInstance(PantryItem, pantryItem);
  }
}
