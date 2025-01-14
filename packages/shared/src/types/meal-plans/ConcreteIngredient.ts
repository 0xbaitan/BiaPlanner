import { IBaseEntity } from "../BaseEntity";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { IRecipeIngredient } from "./RecipeIngredient";

export interface IConcreteIngredient extends IBaseEntity {
  recipeId: string;
  recipe: IRecipe;
  ingredientId: string;
  ingredient: IRecipeIngredient;
  pantryId: IPantryItem;
  pantryItem: IPantryItem;
}
