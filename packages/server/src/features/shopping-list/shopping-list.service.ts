import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListEntity } from './shopping-list.entity';
import { Repository } from 'typeorm';
import {
  CreateShoppingListDto,
  IUpdateShoppingListDto,
} from '@biaplanner/shared';
import { ShoppingItemService } from './shopping-item/shopping-item.service';

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
    });
    return shoppingList;
  }

  public async create(dto: CreateShoppingListDto) {
    const shoppingList = this.shoppingListRepository.create(dto);
    return this.shoppingListRepository.save(shoppingList);
  }

  public async update(id: string, dto: IUpdateShoppingListDto) {
    const shoppingList = await this.findOne(id);
    delete shoppingList.items;
    const updatedShoppingList = this.shoppingListRepository.merge(
      shoppingList,
      dto,
    );
    return this.shoppingListRepository.save(updatedShoppingList);
  }

  public async delete(id: string) {
    const shoppingList = await this.findOne(id);
    return this.shoppingListRepository.softDelete(shoppingList.id);
  }
}
