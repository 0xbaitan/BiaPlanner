import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';
import { ReadBrandDto } from '@biaplanner/shared';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,
  ) {}

  public async readBrands(dto: ReadBrandDto) {
    const brands = this.brandRepository.find({
      where: {},
    });

    return brands;
  }
}
