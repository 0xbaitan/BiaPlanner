import { IsBoolean, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, Min } from "class-validator";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";

import { ApiProperty } from "@nestjs/swagger";
import { Brand } from "./Brand";
import { Product } from "./Product";
import { Reminder } from "../reminder";
import { User } from "../User";

export class PantryItem {
  id?: number;

  createdById?: number;

  createdBy?: User;

  product?: Product;

  productId?: number;

  quantity: number;

  expiryDate?: string;

  addedDate?: string;

  bestBeforeDate?: string;

  manufacturedDate?: string;

  openedDate?: string;

  isExpired?: boolean;

  reminders?: Reminder[];
}

export class CreatePantryItemDto extends OmitType(PantryItem, ["id", "product", "reminders"]) {}
export class UpdatePantryItemDto extends PartialType(PantryItem) {}
export class DeletePantryItemDto extends PickType<PantryItem, keyof PantryItem>(PantryItem, ["id"]) {}
export class ReadSinglePantryItemDto extends PickType<PantryItem, keyof PantryItem>(PantryItem, ["id"]) {}

export interface IPantryItem extends PantryItem {}
export interface ICreatePantryItemDto extends CreatePantryItemDto {}
export interface IUpdatePantryItemDto extends UpdatePantryItemDto {}
export interface IDeletePantryItemDto extends DeletePantryItemDto {}
export interface IReadSinglePantryItemDto extends ReadSinglePantryItemDto {}
