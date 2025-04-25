import { CookingMeasurement, CookingMeasurementSchema } from "../CookingMeasurement";

import { IBaseEntity } from "../BaseEntity";
import { IConcreteIngredient } from "./ConcreteIngredient";
import { IPantryItem } from "../pantry";
import { z } from "zod";

export interface IPantryItemPortion extends IBaseEntity {
  pantryItemId: string;
  pantryItem: IPantryItem;
  portion?: CookingMeasurement;
  concreteIngredientId?: string;
  concreteIngredient?: IConcreteIngredient;
}

export interface ICreatePantryItemPortionDto {
  pantryItemId: string;
  portion: CookingMeasurement;
  concreteIngredientId?: string;
}

export interface IUpdatePantryItemPortionDto {
  portion?: CookingMeasurement;
}

export class CreatePantryItemPortionDto implements ICreatePantryItemPortionDto {
  pantryItemId: string;
  portion: CookingMeasurement;
  concreteIngredientId: string;
}

export class UpdatePantryItemPortionDto implements IUpdatePantryItemPortionDto {
  portion?: CookingMeasurement;
}

export const PantryItemPortionSchema = {
  pantryItemId: z.string(),
  portion: z.object(CookingMeasurementSchema).optional(),
  concreteIngredientId: z.string().optional(),
};
