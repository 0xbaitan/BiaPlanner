import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { ProductClassification } from "./ProductClassification";

export class Product {
  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: "ID must be a positive number",
  })
  @ApiProperty()
  id?: number;

  @IsString()
  @IsNotEmpty({
    message: "Product name is required",
  })
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  productClassification?: ProductClassification;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  productClassificationId?: number;
}

export class CreateProductDto extends Product {}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class DeleteProductDto extends Product {}

export interface IProduct extends Product {}
export interface ICreateProductDto extends CreateProductDto {}
export interface IUpdateProductDto extends UpdateProductDto {}
export interface IDeleteProductDto extends DeleteProductDto {}
