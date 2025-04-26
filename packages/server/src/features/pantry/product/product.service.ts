import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  Approximates,
  CookingMeasurement,
  CookingMeasurementType,
  CreateProductDto,
  getCookingMeasurement,
  ICookingMeasurement,
  IProduct,
  IProductCategory,
  UpdateProductDto,
  Volumes,
  Weights,
} from '@biaplanner/shared';
import { DeepPartial, Repository } from 'typeorm';
import { ProductCategoryService } from './category/product-category.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject(ProductCategoryService)
    private productCategoryService: ProductCategoryService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    let product = this.productRepository.create(dto);
    this.populateWithAppropriateMeasurementType(product, dto.measurement);
    return this.productRepository.save(product);
  }

  async findAllProducts(): Promise<IProduct[]> {
    return this.productRepository.find({
      relations: [
        'productCategories',
        'pantryItems',
        'createdBy',
        'brand',
        'cover',
      ],
    });
  }

  async readProductById(id: string): Promise<IProduct> {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories', 'pantryItems', 'createdBy', 'cover'],
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories', 'pantryItems', 'createdBy', 'brand'],
    });

    delete product.productCategories;
    const updatedProduct = this.productRepository.merge(product, dto);
    this.populateWithAppropriateMeasurementType(
      updatedProduct,
      dto.measurement,
    );

    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  private populateWithAppropriateMeasurementType(
    product: IProduct,
    measurement: CookingMeasurement,
  ) {
    product.measurementType = getCookingMeasurement(measurement.unit).type;
  }
}
