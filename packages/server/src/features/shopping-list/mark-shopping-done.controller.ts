import {
  IUser,
  MarkShoppingListDoneSchema,
  IMarkShoppingListDoneDto,
} from '@biaplanner/shared';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { User } from '../user-info/authentication/user.decorator';
import { MarkShoppingDoneService } from './mark-shopping-done.service';
import { ZodValidationPipe } from 'nestjs-zod';

const MarkShoppingDoneDtoValidationPipe = new ZodValidationPipe(
  MarkShoppingListDoneSchema,
);
@Controller('/mark-shopping-done')
export class MarkShoppingDoneController {
  constructor(
    private readonly markShoppingDoneService: MarkShoppingDoneService,
  ) {}

  @Put(':id')
  async markShoppingDone(
    @Param('id') id: string,
    @Body(MarkShoppingDoneDtoValidationPipe) dto: IMarkShoppingListDoneDto,
    @User() user: IUser,
  ) {
    return this.markShoppingDoneService.markShoppingDone(
      { ...dto, id },
      user.id,
    );
  }
}
