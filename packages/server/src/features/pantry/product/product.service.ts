import {
  BadRequestException,
  ConsoleLogger,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  Approximates,
  CookingMeasurement,
  CookingMeasurementType,
  getCookingMeasurement,
  ICookingMeasurement,
  IFile,
  IProduct,
  IProductCategory,
  IWriteProductDto,
  Volumes,
  Weights,
} from '@biaplanner/shared';
import { DeepPartial, Repository } from 'typeorm';
import { ProductCategoryService } from './category/product-category.service';
import { plainToInstance } from 'class-transformer';
import { FilesService } from '@/features/files/files.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject(ProductCategoryService)
    private productCategoryService: ProductCategoryService,
    @Inject(FilesService)
    private filesService: FilesService,
  ) {}

  async readProductById(id: string): Promise<IProduct> {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        productCategories: true,
        pantryItems: true,
        createdBy: true,
        brand: true,
        cover: true,
        shoppingItems: true,
      },
    });
    if (!product) {
      throw new BadRequestException('Product not found for given id');
    }
    return product;
  }

  async createProduct(
    dto: IWriteProductDto,
    file: Express.Multer.File,
  ): Promise<IProduct> {
    delete dto.file;
    let product = this.productRepository.create(dto);

    if (file) {
      const fileMetadata = await this.filesService.registerNewFile(
        file,
        'product',
      );
      product.coverId = fileMetadata.id;
    }

    if (dto.measurement) {
      this.populateWithAppropriateMeasurementType(product, dto.measurement);
    }

    return this.productRepository.save(product);
  }

  private async manageProductCoverDuringUpdate(
    id: string,
    file?: Express.Multer.File,
  ) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        cover: true,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found for given id');
    }

    let fileMetadata: IFile | null = null;

    if (product.coverId && file) {
      fileMetadata = await this.filesService.overrideExistingFile(
        product.coverId,
        file,
        'product',
      );
    } else if (product.coverId && !file) {
      await this.filesService.unregisterExistingFile(product.coverId);
      fileMetadata = null;
    } else if (!product.coverId && file) {
      fileMetadata = await this.filesService.registerNewFile(file, 'product');
    } else {
      fileMetadata = null;
    }

    await this.productRepository.update(id, { coverId: fileMetadata?.id });
    return fileMetadata;
  }

  async updateProduct(
    id: string,
    dto: IWriteProductDto,
    file?: Express.Multer.File,
  ): Promise<IProduct> {
    delete dto.file;
    await this.manageProductCoverDuringUpdate(id, file);

    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories', 'pantryItems', 'createdBy', 'brand'],
    });

    delete product.productCategories;
    const updatedProduct = this.productRepository.merge(product, dto);

    if (dto.measurement) {
      this.populateWithAppropriateMeasurementType(
        updatedProduct,
        dto.measurement,
      );
    }

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
