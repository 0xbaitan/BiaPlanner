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
  ICreateShoppingListDto,
  IUpdateShoppingListDto,
} from '@biaplanner/shared';

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
    return this.shoppingListService.findOne(id);
  }

  @Post('/')
  async create(@Body() dto: ICreateShoppingListDto) {
    return this.shoppingListService.create(dto);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: IUpdateShoppingListDto) {
    return this.shoppingListService.update(id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.shoppingListService.delete(id);
  }
}
