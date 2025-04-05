import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import { Repository } from 'typeorm';
import { IPantryItem } from '@biaplanner/shared';

@Injectable()
export class ComputExpiryDatesService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private pantryItemRepository: Repository<PantryItemEntity>,
  ) {}

  async findExpiringItems(
    userId: string,
    maxDaysLeftThreshold: number,
  ): Promise<IPantryItem[]> {
    const qb = this.pantryItemRepository
      .createQueryBuilder('pantryItem')
      .select('pantryItem')
      .leftJoinAndSelect('pantryItem.product', 'product')
      .leftJoin('pantryItem.createdBy', 'createdBy')
      .where('pantryItem.createdById = :userId', { userId })
      .andWhere('pantryItem.expiryDate IS NOT NULL')
      .andWhere('pantryItem.isExpired = false')
      .andWhere(
        'DATEDIFF(pantryItem.expiryDate, NOW()) <= :maxDaysLeftThreshold',
        { maxDaysLeftThreshold },
      );
    const pantryItems = await qb.getMany();
    return pantryItems;
  }

  async findItemsToMarkAsExpired(userId?: string) {
    const qb = this.pantryItemRepository
      .createQueryBuilder('pantryItem')
      .select('pantryItem')
      .where('pantryItem.expiryDate IS NOT NULL')
      .andWhere('pantryItem.isExpired = false')
      .andWhere('DATEDIFF(pantryItem.expiryDate, NOW()) < 0');

    if (userId) {
      qb.andWhere('pantryItem.createdById = :userId', { userId });
    }
    const pantryItems = await qb.getMany();
    return pantryItems;
  }

  async markItemsAsExpired(): Promise<IPantryItem[]> {
    const pantryItems = await this.findItemsToMarkAsExpired();
    const pantryItemIds = pantryItems.map((item) => item.id);
    if (pantryItemIds.length === 0) {
      return [];
    }
    const qb = this.pantryItemRepository
      .createQueryBuilder()
      .update(PantryItemEntity)
      .set({ isExpired: true })
      .where('id IN (:...pantryItemIds)', { pantryItemIds });
    await qb.execute();
    console.log('Expired items marked successfully');
    const items = await this.pantryItemRepository
      .createQueryBuilder('pantryItem')
      .select('pantryItem')
      .where('pantryItem.id IN (:...pantryItemIds)', { pantryItemIds })
      .getMany();
    return items;
  }
}
