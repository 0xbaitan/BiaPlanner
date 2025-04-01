import { IBrand } from "./Brand";
import { IProduct } from "./Product";

export interface IQueryProductView extends Pick<IProduct, "id" | "name" | "description" | "brandId" | "measurement" | "measurementType" | "productCategories"> {
  brandName?: string;
}
