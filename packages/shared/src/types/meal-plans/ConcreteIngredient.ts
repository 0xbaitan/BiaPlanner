import { CookingMeasurement } from "../CookingMeasurement";
import { IBaseEntity } from "../BaseEntity";
import { IConcreteRecipe } from "./ConcreteRecipe";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { IRecipeIngredient } from "./RecipeIngredient";

export interface IConcreteIngredient extends IBaseEntity {
  concreteRecipeId: string;
  concreteRecipe: IConcreteRecipe;
  ingredientId: string;
  ingredient: IRecipeIngredient;
  pantryId: IPantryItem;
  pantryItem: IPantryItem;
  measurement?: CookingMeasurement;
}
