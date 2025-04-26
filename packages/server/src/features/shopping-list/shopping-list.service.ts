import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListEntity } from './shopping-list.entity';
import { Repository } from 'typeorm';
import {
  CreateShoppingListDto,
  IUpdateShoppingListDto,
  IWriteShoppingListDto,
  WriteShoppingListItemSchema,
} from '@biaplanner/shared';
import { ShoppingItemService } from './shopping-item/shopping-item.service';
import { ZodValidationPipe } from 'nestjs-zod';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingListEntity)
    private shoppingListRepository: Repository<ShoppingListEntity>,
    @Inject(ShoppingItemService)
    private shoppingItemService: ShoppingItemService,
  ) {}

  public async findAll() {
    const shoppingLists = await this.shoppingListRepository.find();
    return shoppingLists;
  }

  public async findOne(id: string) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({
      where: { id },
      relations: ['items', 'items.product', 'items.replacement'],
    });
    return shoppingList;
  }

  public async create(dto: IWriteShoppingListDto) {
    const shoppingList = this.shoppingListRepository.create(dto);
    return this.shoppingListRepository.save(shoppingList);
  }

  public async update(id: string, dto: IWriteShoppingListDto) {
    const shoppingListExists = await this.shoppingListRepository.exists({
      where: { id },
    });
    if (!shoppingListExists) {
      const errorMessage = `Shopping list with ID ${id} does not exist.`;
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    return this.shoppingListRepository.save(dto);
  }

  public async delete(id: string) {
    const shoppingList = await this.findOne(id);
    return this.shoppingListRepository.softDelete(shoppingList.id);
  }
}
