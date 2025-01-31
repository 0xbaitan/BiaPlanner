import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";

export interface IRecipeTag extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}

export interface ICreateRecipeTagDto extends Pick<IRecipeTag, "name" | "description"> {}

export interface IUpdateRecipeTagDto extends Partial<ICreateRecipeTagDto>, Pick<IRecipeTag, "id"> {}

export class CreateRecipeTagDto implements ICreateRecipeTagDto {
  name: string;
  description?: string;
}

export class UpdateRecipeTagDto implements IUpdateRecipeTagDto {
  id: string;
  name?: string;
  description?: string;
}
