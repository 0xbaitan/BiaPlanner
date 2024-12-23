import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";
import { PartialType, PickType } from "@nestjs/mapped-types";
import { Volumes, Weights } from "../units";

import { ApiProperty } from "@nestjs/swagger";
import { Brand } from "./Brand";
import { PantryItem } from "./PantryItem";
import { ProductCategory } from "./ProductCategory";
import { User } from "../User";

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
  @IsArray()
  @ApiProperty()
  productCategoryIds?: number[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  productCategories?: ProductCategory[];

  @IsOptional()
  @IsObject()
  @ApiProperty()
  brand?: Brand;

  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: "Brand ID must be a positive number",
  })
  @ApiProperty()
  brandId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  canExpire?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  canQuicklyExpireAfterOpening?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  millisecondsToExpiryAfterOpening?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  pantryItems?: PantryItem[];

  @IsOptional()
  @IsObject()
  @ApiProperty()
  createdBy?: User;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  createdById?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isGlobal?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isLoose?: boolean;

  @IsOptional()
  @ApiProperty()
  useMeasurementMetric?: MeasurementMetric;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  numberOfServingsOrPieces?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  weightPerContainerOrPacket?: number;

  @IsOptional()
  @ApiProperty()
  weightUnit?: Weights;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  volumePerContainerOrPacket?: number;

  @IsOptional()
  @ApiProperty()
  volumeUnit?: Volumes;
}

export type MeasurementMetric = "weight" | "volume";

export class CreateProductDto extends Product {}
export class ReadProductDto {
  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: "ID must be a positive number",
  })
  @ApiProperty()
  id?: number;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class DeleteProductDto extends Product {}

export interface IProduct extends Product {}
export interface ICreateProductDto extends CreateProductDto {}
export interface IReadProductDto extends ReadProductDto {}
export interface IUpdateProductDto extends UpdateProductDto {}
export interface IDeleteProductDto extends DeleteProductDto {}
