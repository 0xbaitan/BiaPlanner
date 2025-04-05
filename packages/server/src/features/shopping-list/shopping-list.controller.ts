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
  ICreateShoppingListDto,
  IUpdateShoppingItemExtendedDto,
  IUpdateShoppingListDto,
  IUpdateShoppingListExtendedDto,
  IUser,
  UpdateShoppingListDto,
  UpdateShoppingListExtendedDto,
} from '@biaplanner/shared';
import { User } from '../user-info/authentication/user.decorator';
import { MarkShoppingDoneService } from './mark-shopping-done.service';

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
  async create(@Body() dto: CreateShoppingListDto) {
    return this.shoppingListService.create(dto);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateShoppingListDto) {
    return this.shoppingListService.update(id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.shoppingListService.delete(id);
  }
}
