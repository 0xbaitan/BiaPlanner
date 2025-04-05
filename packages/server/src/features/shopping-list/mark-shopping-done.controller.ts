import { UpdateShoppingListExtendedDto, IUser } from '@biaplanner/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../user-info/authentication/user.decorator';
import { MarkShoppingDoneService } from './mark-shopping-done.service';

@Controller('/mark-shopping-done')
export class MarkShoppingDoneController {
  constructor(
    private readonly markShoppingDoneService: MarkShoppingDoneService,
  ) {}

  @Post('/')
  async markShoppingDone(
    @Body() dto: UpdateShoppingListExtendedDto,
    @User() user: IUser,
  ) {
    return this.markShoppingDoneService.markShoppingDone(dto, user.id);
  }
}
