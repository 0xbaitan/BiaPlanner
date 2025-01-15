import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';

import { Repository } from 'typeorm';
import { ICreateBrandDto } from '@biaplanner/shared';

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

  public async createBrand(dto: ICreateBrandDto) {
    const newBrand = this.brandRepository.create(dto);
    return this.brandRepository.save(newBrand);
  }
}
