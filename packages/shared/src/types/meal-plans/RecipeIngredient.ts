import { Approximates, CookingMeasurementUnit, Volumes, Weights } from "../units";

import { CookingMeasurement } from "../CookingMeasurement";
import { IBaseEntity } from "../BaseEntity";
import { IProductCategory } from "../pantry";
import { IRecipe } from "./Recipe";

export interface IRecipeIngredient extends IBaseEntity {
  title?: string;
  productCategories: IProductCategory[];
  measurement?: CookingMeasurement;
  recipeId?: string;
  recipe?: IRecipe;
}
