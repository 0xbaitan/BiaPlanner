import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductClassificationEntity } from './product-classification.entity';
import { Repository } from 'typeorm';
import {
  CreateProductClassificationDto,
  ReadProductClassificationDto,
  UpdateProductClassificationDto,
} from '@biaplanner/shared';

@Injectable()
export class ProductClassificationService {
  constructor(
    @InjectRepository(ProductClassificationEntity)
    private readonly productClassificationRepository: Repository<ProductClassificationEntity>,
  ) {}

  async readProductClassifications(dto: ReadProductClassificationDto) {
    return this.productClassificationRepository.find({
      where: dto,
      relations: ['products'],
    });
  }

  async readProductClassificationById(id: number) {
    return this.productClassificationRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async createProductClassification(dto: CreateProductClassificationDto) {
    const productClassification =
      this.productClassificationRepository.create(dto);
    return this.productClassificationRepository.save(productClassification);
  }

  async updateProductClassification(
    id: number,
    dto: UpdateProductClassificationDto,
  ) {
    const productClassification =
      await this.productClassificationRepository.findOneOrFail({
        where: {
          id,
        },
      });
    return this.productClassificationRepository.save({
      ...productClassification,
      ...dto,
    });
  }

  async deleteProductClassification(id: number) {
    const productClassification =
      await this.productClassificationRepository.findOneOrFail({
        where: {
          id,
        },
      });
    return this.productClassificationRepository.remove(productClassification);
  }
}
