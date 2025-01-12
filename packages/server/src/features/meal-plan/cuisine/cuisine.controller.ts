import { Controller, Get, Inject } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { ICuisine } from '@biaplanner/shared';

@Controller('/meal-plan/cuisines')
export class CuisineController {
  constructor(@Inject(CuisineService) private cuisineService: CuisineService) {}

  @Get('/')
  async findAllCuisines(): Promise<ICuisine[]> {
    const cuisines = await this.cuisineService.findAll();
    return cuisines;
  }
}
