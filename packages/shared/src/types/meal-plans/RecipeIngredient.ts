import { Approximates, CookingMeasurementUnit, Volumes, Weights } from "../units";

import { IBaseEntity } from "../BaseEntity";
import { IProductCategory } from "../pantry";
import { IRecipe } from "./Recipe";

export interface IRecipeIngredient extends IBaseEntity {
  productCategories: IProductCategory[];
  quantity: number;
  volumeUnit: Volumes | null;
  weightUnit: Weights | null;
  approximateUnit: Approximates | null;
  recipeId?: string;
  recipe?: IRecipe;
}
