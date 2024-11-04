import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { Product } from "./Product";

export class ProductClassification {
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
  classificationName: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  products?: Product[];
}

export class CreateProductClassificationDto extends ProductClassification {}
export class UpdateProductClassificationDto extends PartialType(CreateProductClassificationDto) {}
export class DeleteProductClassificationDto extends ProductClassification {}

export interface IProductClassification extends ProductClassification {}
export interface ICreateProductClassificationDto extends CreateProductClassificationDto {}
export interface IUpdateProductClassificationDto extends UpdateProductClassificationDto {}
export interface IDeleteProductClassificationDto extends DeleteProductClassificationDto {}
