import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';

import { Repository } from 'typeorm';
import { ICreateBrandDto, IUpdateBrandDto } from '@biaplanner/shared';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,
  ) {}

  public async findAllBrands() {
    const brands = await this.brandRepository.find();
    return brands;
  }

  public async findBrandById(id: string) {
    const brand = await this.brandRepository.findOneOrFail({
      where: { id },
    });
    return brand;
  }

  public async createBrand(dto: ICreateBrandDto) {
    const newBrand = this.brandRepository.create(dto);
    return this.brandRepository.save(newBrand);
  }

  public async updateBrand(id: string, dto: IUpdateBrandDto) {
    const brand = await this.findBrandById(id);
    const updatedBrand = this.brandRepository.merge(brand, dto);
    return this.brandRepository.save(updatedBrand);
  }
}
