import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";

export interface ICuisine extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}

export interface ICreateCuisineDto extends Pick<ICuisine, "name" | "description"> {}

export interface IUpdateCuisineDto extends Partial<ICreateCuisineDto>, Pick<ICuisine, "id"> {}

export class CreateCuisineDto implements ICreateCuisineDto {
  name: string;
  description?: string;
}

export class UpdateCuisineDto implements IUpdateCuisineDto {
  id: string;
  name?: string;
  description?: string;
}
