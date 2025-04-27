import {
  CookingMeasurement,
  CreateProductDto,
  ICreateProductDto,
  IProductCategory,
  UpdateProductDto,
} from '@biaplanner/shared';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductCategoryService } from './category/product-category.service';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let productCategoryService: ProductCategoryService;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  };

  const mockProductCategoryService = {
    // Mock any methods used from ProductCategoryService if needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
        {
          provide: ProductCategoryService,
          useValue: mockProductCategoryService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    productCategoryService = module.get<ProductCategoryService>(
      ProductCategoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and save a product', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product',
        measurement: { magnitude: 1, unit: 'kg' } as CookingMeasurement,
        brandId: 'brand-id',
        productCategories: [{ id: 'category-id' } as IProductCategory],

        canExpire: false,
        canQuicklyExpireAfterOpening: false,
        createdById: 'user-id',
        isLoose: false,
        timeTillExpiryAfterOpening: {
          magnitude: 1,
          unit: 'days',
        } as CookingMeasurement,
        },
        description: 'Test description',

      };

      const createdProduct = { id: '1', ...dto };
      mockProductRepository.create.mockReturnValue(createdProduct);
      mockProductRepository.save.mockResolvedValue(createdProduct);

      const result = await service.createProduct(dto);

      expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products with relations', async () => {
      const products = [{ id: '1', name: 'Product 1' }];
      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findAllProducts();

      expect(mockProductRepository.find).toHaveBeenCalledWith({
        relations: [
          'productCategories',
          'pantryItems',
          'createdBy',
          'brand',
          'cover',
        ],
      });
      expect(result).toEqual(products);
    });
  });

  describe('readProductById', () => {
    it('should return a product by ID', async () => {
      const product = { id: '1', name: 'Product 1' };
      mockProductRepository.findOneOrFail.mockResolvedValue(product);

      const result = await service.readProductById('1');

      expect(mockProductRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['productCategories', 'pantryItems', 'createdBy', 'cover'],
      });
      expect(result).toEqual(product);
    });

    it('should throw an error if product is not found', async () => {
      mockProductRepository.findOneOrFail.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(service.readProductById('1')).rejects.toThrow(
        'Product not found',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update and save a product', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated Product',
        measurement: { magnitude: 2, unit: 'g' } as CookingMeasurement,
      };

      const existingProduct = { id: '1', name: 'Old Product' };
      const updatedProduct = { ...existingProduct, ...dto };

      mockProductRepository.findOneOrFail.mockResolvedValue(existingProduct);
      mockProductRepository.merge.mockReturnValue(updatedProduct);
      mockProductRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct('1', dto);

      expect(mockProductRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['productCategories', 'pantryItems', 'createdBy', 'brand'],
      });
      expect(mockProductRepository.merge).toHaveBeenCalledWith(
        existingProduct,
        dto,
      );
      expect(mockProductRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      mockProductRepository.delete.mockResolvedValue(undefined);

      await service.deleteProduct(1);

      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
