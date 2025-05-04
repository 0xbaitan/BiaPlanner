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
import { create } from 'domain';
import { identity } from 'rxjs';

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
      await this.pantryItemService.findPantryItems(createdById);

    return pantryItems;
  }

  @Post('/')
  async createPantryItem(
    @Body(WritePantryItemValidationPipe) dto: IWritePantryItemDto,
    @User() { id: createdById }: IUser,
  ): Promise<IPantryItem> {
    const pantryItem = await this.pantryItemService.create(dto, createdById);
    return pantryItem;
  }

  @Put('/consume/:id')
  async consumePantryItem(
    @Param('id') pantryItemId: string,
    @Body(ConsumePantryItemValidationPipe)
    dto: IConsumePantryItemDto,
  ): Promise<IPantryItem> {
    const pantryItem = await this.pantryItemService.consumePortion(
      pantryItemId,
      dto,
    );
    return pantryItem;
  }
}
