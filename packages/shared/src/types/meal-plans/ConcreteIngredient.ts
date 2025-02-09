import { CookingMeasurement } from "../CookingMeasurement";
import { IBaseEntity } from "../BaseEntity";
import { IConcreteRecipe } from "./ConcreteRecipe";
import { IPantryItem } from "../pantry";
import { IPantryItemPortion } from "./PantryItemPortion";
import { IRecipe } from "./Recipe";
import { IRecipeIngredient } from "./RecipeIngredient";

export interface IConcreteIngredient extends IBaseEntity {
  concreteRecipeId: string;
  concreteRecipe: IConcreteRecipe;
  ingredientId: string;
  ingredient: IRecipeIngredient;
  pantryItemsWithPortions?: IPantryItemPortion[];
}
