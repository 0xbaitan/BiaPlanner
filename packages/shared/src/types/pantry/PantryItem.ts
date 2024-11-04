import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";
import { PartialType, PickType } from "@nestjs/mapped-types";

import { ApiProperty } from "@nestjs/swagger";
import { Brand } from "./Brand";
import { Product } from "./Product";
import { User } from "../User";
import { Volumes } from "../units/Volumes";
import { Weights } from "../units";

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
    message: "Pantry ID must be a positive number",
  })
  @ApiProperty()
  userId?: number;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  user?: User;

  @ApiProperty()
  @IsString()
  @IsOptional()
  brandedItemName?: string;

  @IsObject({
    message: "Brand must be an object",
  })
  @IsOptional()
  @ApiProperty()
  brand?: Brand;

  @IsOptional()
  @IsNumber()
  @Min(1, {
    message: "Brand ID must be a positive number",
  })
  @ApiProperty()
  brandId?: number;

  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

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
  @IsNumber()
  @ApiProperty()
  millisecondsToExpiryAfterOpening?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isExpired?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  canQuicklyExpireAfterOpening?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  numberOfServingsOrPieces?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  weightPerContainerOrPacket?: number;

  @IsOptional()
  @IsEnum(Weights, {
    message: "Weight unit must be a valid weight unit",
  })
  @ApiProperty()
  weightUnit?: Weights;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  volumePerContainerOrPacket?: number;

  @IsOptional()
  @IsEnum(Weights, {
    message: "Volume unit must be a valid volume unit",
  })
  @ApiProperty()
  volumeUnit?: Volumes;
}

export class CreatePantryItemDto extends PantryItem {}
export class UpdatePantryItemDto extends PartialType(PantryItem) {}
export class DeletePantryItemDto extends PickType(PantryItem, ["id"]) {}
export class ReadSinglePantryItemDto extends PickType(PantryItem, ["id"]) {}

export interface IPantryItem extends PantryItem {}
export interface ICreatePantryItemDto extends CreatePantryItemDto {}
export interface IUpdatePantryItemDto extends UpdatePantryItemDto {}
export interface IDeletePantryItemDto extends DeletePantryItemDto {}
export interface IReadSinglePantryItemDto extends ReadSinglePantryItemDto {}
