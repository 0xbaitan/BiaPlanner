import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ComputExpiryDatesService } from './compute-expiry-dates.service';
import { IPantryItem, IUser } from '@biaplanner/shared';
import { User } from '@/features/user-info/authentication/user.decorator';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('/pantry/shelf-life')
export class ShelfLifePantryItemController {
  constructor(
    @Inject(ComputExpiryDatesService)
    private pantryItemService: ComputExpiryDatesService,
  ) {}

  @Get('/expiring-items')
  async findExpiringItems(
    @User() user: IUser,
    @Query('maxDaysLeft') maxDaysLeft: string,
  ): Promise<IPantryItem[]> {
    return this.pantryItemService.findExpiringItems(
      user.id,
      Number(maxDaysLeft),
    );
  }

  @Get('/expired-items')
  async findExpiredItems(@User() user: IUser): Promise<IPantryItem[]> {
    return this.pantryItemService.findItemsToMarkAsExpired(user.id);
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async markItemsAsExpired(): Promise<IPantryItem[]> {
    return this.pantryItemService.markItemsAsExpired();
  }
}
