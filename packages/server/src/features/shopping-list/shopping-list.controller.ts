import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import {
  CreateShoppingListDto,
  IWriteShoppingListDto,
  UpdateShoppingListDto,
  WriteShoppingListItemSchema,
  WriteShoppingListSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const WriteShoppingListDtoValidationPipe = new ZodValidationPipe(
  WriteShoppingListSchema,
);

@Controller('/shopping-lists')
export class ShoppingListController {
  constructor(
    @Inject(ShoppingListService)
    private shoppingListService: ShoppingListService,
  ) {}

  @Get('/')
  async findAll() {
    return this.shoppingListService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    console.log('findOne', id);
    return this.shoppingListService.findOne(id);
  }

  @Post('/')
  async create(
    @Body(WriteShoppingListDtoValidationPipe) dto: IWriteShoppingListDto,
  ) {
    return this.shoppingListService.create(dto);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: IWriteShoppingListDto) {
    return this.shoppingListService.update(id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.shoppingListService.delete(id);
    return { message: 'Shopping list deleted successfully' };
  }
}
