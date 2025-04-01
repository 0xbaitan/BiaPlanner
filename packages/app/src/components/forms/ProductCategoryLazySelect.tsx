import { DeepPartial } from "utility-types";
import { IProductCategory } from "@biaplanner/shared";
import LazySelect from "./LazySelect";
import { useLazySearchProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export default function ProductCategoryLazySelect() {
  const [searchProductCategories, { isLoading, isError, isSuccess }] = useLazySearchProductCategoriesQuery();
  return (
    <LazySelect<DeepPartial<IProductCategory>>
      loadList={async (search) => {
        const result = await searchProductCategories({ search }).unwrap();
        return result.data;
      }}
      isSuccess={isSuccess}
      isLoading={isLoading}
      isError={isError}
      idSelector={(productCategory) => productCategory.id ?? "N/A"}
      nameSelector={(productCategory) => productCategory.name ?? "N/A"}
      placeholder="Search for product categories..."
    />
  );
}
