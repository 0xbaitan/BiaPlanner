import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';

import { Repository } from 'typeorm';
import { IFile, IWriteBrandDto } from '@biaplanner/shared';
import { FilesService } from '@/features/files/files.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,
    @Inject(FilesService) private filesService: FilesService,
  ) {}

  public async findAllBrands() {
    const brands = await this.brandRepository.find();
    return brands;
  }

  public async findBrandById(id: string) {
    const brand = await this.brandRepository.findOneOrFail({
      where: { id },
      relations: {
        products: true,
        logo: true,
      },
    });
    return brand;
  }

  public async createBrand(dto: IWriteBrandDto, file: Express.Multer.File) {
    delete dto.file;
    const newBrand = this.brandRepository.create(dto);
    if (file) {
      const fileMetadata = await this.filesService.registerNewFile(
        file,
        'brand',
      );
      newBrand.logoId = fileMetadata.id;
    }
    return this.brandRepository.save(newBrand);
  }

  private async manageBrandLogoDuringUpdate(
    id: string,
    file?: Express.Multer.File,
  ) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: {
        logo: true,
      },
    });
    if (!brand) {
      throw new BadRequestException('Brand not found for given id');
    }
    let fileMetadata: IFile | null = null;
    if (brand.logoId && file) {
      fileMetadata = await this.filesService.overrideExistingFile(
        brand.logoId,
        file,
        'brand',
      );
    } else if (brand.logoId && !file) {
      await this.filesService.unregisterExistingFile(brand.logoId);
      fileMetadata = null;
    } else if (!brand.logoId && file) {
      fileMetadata = await this.filesService.registerNewFile(file, 'brand');
    } else {
      fileMetadata = null;
    }

    this.brandRepository.update(id, { logoId: fileMetadata?.id });
    return fileMetadata;
  }

  public async updateBrand(
    id: string,
    dto: IWriteBrandDto,
    file?: Express.Multer.File,
  ) {
    delete dto.file;
    await this.manageBrandLogoDuringUpdate(id, file);

    await this.brandRepository.update(id, dto);

    const updatedBrand = await this.brandRepository.findOneOrFail({
      where: { id },
      relations: {
        logo: true,
      },
    });
    return updatedBrand;
  }

  public async deleteBrand(id: string) {
    const brand = await this.findBrandById(id);
    return this.brandRepository.softDelete({
      id: brand.id,
    });
  }
}
