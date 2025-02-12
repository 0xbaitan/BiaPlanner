import { ICreatePantryItemPortionDto, IPantryItemPortion } from "./PantryItemPortion";

import { CookingMeasurement } from "../CookingMeasurement";
import { IBaseEntity } from "../BaseEntity";
import { IConcreteRecipe } from "./ConcreteRecipe";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { IRecipeIngredient } from "./RecipeIngredient";

export interface IConcreteIngredient extends IBaseEntity {
  concreteRecipeId?: string;
  concreteRecipe?: IConcreteRecipe;
  ingredientId?: string;
  ingredient?: IRecipeIngredient;
  pantryItemsWithPortions?: IPantryItemPortion[];
}

export interface ICreateConcreteIngredientDto {
  concreteRecipeId?: string;
  ingredientId: string;
  pantryItemsWithPortions?: ICreatePantryItemPortionDto[];
}
