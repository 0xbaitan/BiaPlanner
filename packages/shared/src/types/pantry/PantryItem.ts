import { IsBoolean, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, Min } from "class-validator";
import { PartialType, PickType } from "@nestjs/mapped-types";

import { ApiProperty } from "@nestjs/swagger";
import { Brand } from "./Brand";
import { Product } from "./Product";
import { User } from "../User";

export class PantryItem {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Min(1, {
    message: "ID must be a positive number",
  })
  id?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, {
    message: "created by  must be a positive number",
  })
  @ApiProperty()
  createdById?: number;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  createdBy?: User;

  @IsObject()
  @IsNotEmptyObject()
  @ApiProperty()
  product: Product;

  @IsNumber()
  @IsOptional()
  @Min(1, {
    message: "Product ID must be a positive number",
  })
  @ApiProperty()
  productId?: number;

  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsDateString({
    strict: true,
  })
  @IsOptional()
  @ApiProperty()
  expiryDate?: string;

  @IsDateString({
    strict: true,
  })
  @IsOptional()
  @ApiProperty()
  addedDate?: string;

  @IsOptional()
  @IsDateString({
    strict: true,
  })
  @ApiProperty()
  bestBeforeDate?: string;

  @IsOptional()
  @IsDateString({
    strict: true,
  })
  @ApiProperty()
  manufacturedDate?: string;

  @IsOptional()
  @IsDateString({
    strict: true,
  })
  @ApiProperty()
  openedDate?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isExpired?: boolean;
}

export class CreatePantryItemDto extends PantryItem {}
export class UpdatePantryItemDto extends PartialType(PantryItem) {}
export class DeletePantryItemDto extends PickType<PantryItem, keyof PantryItem>(PantryItem, ["id"]) {}
export class ReadSinglePantryItemDto extends PickType<PantryItem, keyof PantryItem>(PantryItem, ["id"]) {}

export interface IPantryItem extends PantryItem {}
export interface ICreatePantryItemDto extends CreatePantryItemDto {}
export interface IUpdatePantryItemDto extends UpdatePantryItemDto {}
export interface IDeletePantryItemDto extends DeletePantryItemDto {}
export interface IReadSinglePantryItemDto extends ReadSinglePantryItemDto {}
