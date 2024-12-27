import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import PantryItemService from './pantry-item.service';
import {
  CreatePantryItemDto,
  IPantryItem,
  IUser,
  PantryItem,
} from '@biaplanner/shared';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/features/user-info/authentication/user.decorator';

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
    @User() user: IUser,
  ): Promise<IPantryItem> {
    console.log('user', user);
    const pantryItem = await this.pantryItemService.createPantryItem({
      ...dto,
      createdById: user.id,
    });
    return plainToInstance(PantryItem, pantryItem);
  }
}
