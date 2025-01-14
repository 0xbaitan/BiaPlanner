import { IBaseEntity } from "../BaseEntity";
import { IConcreteIngredient } from "./ConcreteIngredient";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { MealTypes } from "../units";

export interface IConcreteRecipe extends IBaseEntity {
  recipeId: string;
  recipe: IRecipe;
  numberOfServings?: [number, number];
  confirmedIngredients: IConcreteIngredient[];
  mealType: MealTypes;
}
