import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";

export interface IRecipeTag extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}
