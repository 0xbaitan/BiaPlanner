import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PartialType, PickType } from "@nestjs/mapped-types";

import { ApiProperty } from "@nestjs/swagger";
import { Product } from "./Product";

export class ProductCategory {
  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: "ID must be a positive number",
  })
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  products?: Product[];
}

export class CreateProductCategoryDto extends ProductCategory {}
export class ReadProductCategoryDto {
  @IsString()
  @IsNotEmpty({
    message: "Product category name is required",
  })
  @ApiProperty()
  name?: string;
}
export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {}
export class DeleteProductCategoryDto extends ProductCategory {}

export interface IProductCategory extends ProductCategory {}
export interface ICreateProductCategoryDto extends CreateProductCategoryDto {}
export interface IUpdateProductCategoryDto extends UpdateProductCategoryDto {}
export interface IDeleteProductCategoryDto extends DeleteProductCategoryDto {}
