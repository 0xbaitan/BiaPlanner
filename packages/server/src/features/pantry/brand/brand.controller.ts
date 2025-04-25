import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { IWriteBrandDto, WriteBrandDtoSchema } from '@biaplanner/shared';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodParsePipe } from '@/util/zod-validation.pipe';

const WriteBrandValidationPipe = new ZodParsePipe(WriteBrandDtoSchema, true);
@Controller('/brands')
export class BrandController {
  constructor(@Inject(BrandService) private brandService: BrandService) {}

  @Get('/')
  async findAllBrands() {
    return this.brandService.findAllBrands();
  }

  @Get('/:id')
  async findBrandById(@Param('id') id: string) {
    return this.brandService.findBrandById(id);
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'tmp/',
    }),
  )
  async createBrand(
    @Body(WriteBrandValidationPipe) dto: IWriteBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.createBrand(dto, file);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'tmp/',
    }),
  )
  async updateBrand(
    @Param('id') id: string,
    @Body(WriteBrandValidationPipe) dto: IWriteBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.updateBrand(id, dto, file);
  }

  @Delete('/:id')
  async deleteBrand(@Param('id') id: string): Promise<void> {
    await this.brandService.deleteBrand(id);
    return;
  }
}
