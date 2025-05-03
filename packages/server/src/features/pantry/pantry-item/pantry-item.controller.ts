import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import PantryItemService from './pantry-item.service';
import {
  ConsumePantryItemDtoSchema,
  CookingMeasurementType,
  IConsumePantryItemDto,
  IPantryItem,
  IUser,
  IWritePantryItemDto,
  WritePantryItemSchema,
} from '@biaplanner/shared';
import { User } from 'src/features/user-info/authentication/user.decorator';

import { ZodValidationPipe } from 'nestjs-zod';
import { Public } from '@/features/user-info/authentication/public.decorator';

const WritePantryItemValidationPipe = new ZodValidationPipe(
  WritePantryItemSchema,
);

const ConsumePantryItemValidationPipe = new ZodValidationPipe(
  ConsumePantryItemDtoSchema,
);

@Controller('/pantry/items')
export default class PantryItemController {
  constructor(
    @Inject(PantryItemService) private pantryItemService: PantryItemService,
  ) {}

  @Get('/:id')
  async findPantryItemById(
    @Param('id') pantryItemId: string,
  ): Promise<IPantryItem> {
    const pantryItem =
      await this.pantryItemService.findPantryItemById(pantryItemId);

    return pantryItem;
  }

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

  @Put('/consume/:id')
  async consumePantryItem(
    @Body(ConsumePantryItemValidationPipe)
    dto: IConsumePantryItemDto,
  ): Promise<IPantryItem> {
    const pantryItem = await this.pantryItemService.consumePantryItem(dto);
    return pantryItem;
  }
}
