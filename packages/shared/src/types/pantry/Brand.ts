import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PartialType, PickType } from "@nestjs/mapped-types";

import { ApiProperty } from "@nestjs/swagger";
import { PantryItem } from "./PantryItem";
import { Product } from "./Product";

export class Brand {
  @IsNumber()
  @IsOptional()
  @Min(1, {
    message: "ID must be a positive number",
  })
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ApiProperty()
  @IsArray()
  products?: Product[];
}

export class CreateBrandDto extends Brand {}
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
export class DeleteBrandDto extends PickType(Brand, ["id"]) {}

export interface IBrand extends Brand {}
export interface ICreateBrandDto extends CreateBrandDto {}
export interface IUpdateBrandDto extends UpdateBrandDto {}
export interface IDeleteBrandDto extends DeleteBrandDto {}
