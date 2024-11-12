import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { PantryItem } from "./PantryItem";
import { PartialType } from "@nestjs/mapped-types";
import { ProductClassification } from "./ProductClassification";
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
  @IsObject()
  @ApiProperty()
  productClassification?: ProductClassification;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  productClassificationId?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  pantryItems?: PantryItem[];

  @IsOptional()
  @IsObject()
  @ApiProperty()
  user?: User;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  userId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isGlobal?: boolean;
}

export class CreateProductDto extends Product {}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class DeleteProductDto extends Product {}

export interface IProduct extends Product {}
export interface ICreateProductDto extends CreateProductDto {}
export interface IUpdateProductDto extends UpdateProductDto {}
export interface IDeleteProductDto extends DeleteProductDto {}
