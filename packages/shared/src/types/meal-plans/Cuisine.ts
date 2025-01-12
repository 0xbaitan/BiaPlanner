import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";

export interface ICuisine extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}
