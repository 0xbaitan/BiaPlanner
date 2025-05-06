import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  CookingMeasurement,
  getCookingMeasurement,
  IFile,
  IProduct,
  IWriteProductDto,
} from '@biaplanner/shared';
import { Repository, EntityManager, In } from 'typeorm';
import { ProductCategoryService } from './category/product-category.service';
import { FilesService } from '@/features/files/files.service';
import { TransactionContext } from '@/util/transaction-context';
import { ProductCategoryEntity } from './category/product-category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject(ProductCategoryService)
    private productCategoryService: ProductCategoryService,
    @Inject(FilesService)
    private filesService: FilesService,
    private readonly transactionContext: TransactionContext,
  ) {}

  async readProductById(id: string): Promise<IProduct> {
    return this.productRepository.findOneOrFail({
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
  }

  async readAllProducts(): Promise<IProduct[]> {
    return this.productRepository.find({
      relations: {
        productCategories: true,
        pantryItems: true,
        createdBy: true,
        brand: true,
        cover: true,
        shoppingItems: true,
      },
    });
  }

  async createProduct(
    dto: IWriteProductDto,
    file: Express.Multer.File,
  ): Promise<IProduct> {
    return this.transactionContext.execute(async (manager) => {
      return this.createProductWithManager(manager, dto, file);
    });
  }

  async createProductWithManager(
    manager: EntityManager,
    dto: IWriteProductDto,
    file: Express.Multer.File,
  ): Promise<IProduct> {
    delete dto.file;
    const productCategories = dto.productCategoryIds;
    delete dto.productCategoryIds;
    let product = manager.create(ProductEntity, dto);

    if (file) {
      const fileMetadata = await this.filesService.registerNewFileWithManager(
        manager,
        file,
        'product',
      );
      product.coverId = fileMetadata.id;
    }

    if (dto.isLoose) {
      dto.measurement = null;
    }

    if (dto.measurement) {
      this.populateWithAppropriateMeasurementType(product, dto.measurement);
    }

    await manager.insert(ProductEntity, product);

    await manager
      .createQueryBuilder()
      .relation(ProductEntity, 'productCategories')
      .of(product.id)
      .add(productCategories);

    product = await manager.findOneOrFail(ProductEntity, {
      where: { id: product.id },
      relations: {
        productCategories: true,
        pantryItems: true,
        createdBy: true,
        brand: true,
        cover: true,
        shoppingItems: true,
      },
    });

    return product;
  }

  async updateProduct(
    id: string,
    dto: IWriteProductDto,
    file?: Express.Multer.File,
  ): Promise<IProduct> {
    return this.transactionContext.execute(async (manager) => {
      return this.updateProductWithManager(manager, id, dto, file);
    });
  }

  async updateProductWithManager(
    manager: EntityManager,
    id: string,
    dto: IWriteProductDto,
    file?: Express.Multer.File,
  ): Promise<IProduct> {
    delete dto.file;
    await this.manageProductCoverDuringUpdate(manager, id, file);

    const product = await manager.findOne(ProductEntity, {
      where: { id },
      relations: ['productCategories'],
    });

    console.log('dto', dto);
    console.log('product', product);

    const { productCategoryIds, ...rest } = dto;
    const existingProductCategoryIds = product.productCategories.map(
      (category) => category.id,
    );
    if (!product) {
      throw new BadRequestException('Product not found for given id');
    }

    delete product.productCategories;
    const updatedProduct = manager.create(ProductEntity, {
      ...rest,
    });

    if (updatedProduct.isLoose) {
      updatedProduct.measurement = null;
    }

    if (updatedProduct.measurement) {
      this.populateWithAppropriateMeasurementType(
        updatedProduct,
        updatedProduct.measurement,
      );
    }

    await manager.update(ProductEntity, id, updatedProduct);

    const validProductCategoryIds = await manager
      .getRepository(ProductCategoryEntity)
      .findBy({
        id: In(productCategoryIds),
      });
    const validExistingProductCategoryIds = await manager
      .getRepository(ProductCategoryEntity)
      .findBy({
        id: In(existingProductCategoryIds),
      });

    const validProductCategoryIdsSet = new Set(
      validProductCategoryIds.map((category) => category.id),
    );
    const validExistingProductCategoryIdsSet = new Set(
      validExistingProductCategoryIds.map((category) => category.id),
    );

    const filteredProductCategoryIds = productCategoryIds.filter((id) =>
      validProductCategoryIdsSet.has(id),
    );
    const filteredExistingProductCategoryIds =
      existingProductCategoryIds.filter((id) =>
        validExistingProductCategoryIdsSet.has(id),
      );

    await manager
      .createQueryBuilder()
      .relation(ProductEntity, 'productCategories')
      .of(id)
      .addAndRemove(
        filteredProductCategoryIds,
        filteredExistingProductCategoryIds,
      );
    return manager.findOneOrFail(ProductEntity, {
      where: { id },
      relations: [
        'productCategories',
        'pantryItems',
        'createdBy',
        'brand',
        'cover',
      ],
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.transactionContext.execute(async (manager) => {
      return this.deleteProductWithManager(manager, id);
    });
  }

  async deleteProductWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    const product = await manager.findOne(ProductEntity, { where: { id } });

    if (!product) {
      throw new BadRequestException('Product not found for given id');
    }

    if (product.coverId) {
      await this.filesService.unregisterExistingFileWithManager(
        manager,
        product.coverId,
      );
    }

    await manager.delete(ProductEntity, id);
  }

  private async manageProductCoverDuringUpdate(
    manager: EntityManager,
    id: string,
    file?: Express.Multer.File,
  ) {
    const product = await manager.findOne(ProductEntity, {
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
      fileMetadata = await this.filesService.overrideExistingFileWithManager(
        manager,
        product.coverId,
        file,
        'product',
      );
    } else if (product.coverId && !file) {
      await this.filesService.unregisterExistingFileWithManager(
        manager,
        product.coverId,
      );
      fileMetadata = null;
    } else if (!product.coverId && file) {
      fileMetadata = await this.filesService.registerNewFileWithManager(
        manager,
        file,
        'product',
      );
    } else {
      fileMetadata = null;
    }

    await manager.update(ProductEntity, id, { coverId: fileMetadata?.id });
    return fileMetadata;
  }

  private populateWithAppropriateMeasurementType(
    product: IProduct,
    measurement: CookingMeasurement,
  ) {
    product.measurementType = getCookingMeasurement(measurement?.unit).type;
  }
}
