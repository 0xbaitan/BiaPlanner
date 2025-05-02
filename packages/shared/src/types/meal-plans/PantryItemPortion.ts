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

export const WritePantryItemPortionDtoSchema = z.object({
  pantryItemId: z.string().min(1, { message: "Pantry item is required" }),
  portion: z.object(CookingMeasurementSchema),
  concreteIngredientId: z.string().optional(),
  id: z.string().optional(),
});

export const PantryItemPortionSchema = {
  pantryItemId: z.string(),
  portion: z.object(CookingMeasurementSchema).optional(),
  concreteIngredientId: z.string().optional(),
};

export type IWritePantryItemPortionDto = z.infer<typeof WritePantryItemPortionDtoSchema>;
