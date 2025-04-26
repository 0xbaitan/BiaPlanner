import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import {
  ICuisine,
  IWriteCuisineDto,
  IWriteRecipeDto,
  WriteCuisineDtoSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const WriteCuisineValidationPipe = new ZodValidationPipe(WriteCuisineDtoSchema);

@Controller('/meal-plan/cuisines')
export class CuisineController {
  constructor(@Inject(CuisineService) private cuisineService: CuisineService) {}

  @Get('/')
  async findAllCuisines(): Promise<ICuisine[]> {
    const cuisines = await this.cuisineService.findAll();
    return cuisines;
  }

  @Get('/:id')
  async findCuisineById(@Param('id') id: string): Promise<ICuisine> {
    const cuisine = await this.cuisineService.findById(id);
    return cuisine;
  }

  @Post('/')
  async createCuisine(
    @Body(WriteCuisineValidationPipe) dto: ICuisine,
  ): Promise<ICuisine> {
    const newCuisine = await this.cuisineService.create(dto);
    return newCuisine;
  }

  @Put('/:id')
  async updateCuisine(
    @Param('id') id: string,
    @Body(WriteCuisineValidationPipe) dto: IWriteCuisineDto,
  ): Promise<ICuisine> {
    const updatedCuisine = await this.cuisineService.update(id, dto);
    return updatedCuisine;
  }

  @Delete('/:id')
  async deleteCuisine(@Param('id') id: string): Promise<void> {
    await this.cuisineService.delete(id);
  }
}
