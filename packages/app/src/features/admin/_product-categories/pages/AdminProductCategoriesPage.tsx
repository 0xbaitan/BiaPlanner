import ProductCategoriesTable from "../components/ProductCategoriesTable";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export default function AdminProductCategoriesPage() {
  const { data: productCategories, isSuccess, isError } = useGetProductCategoriesQuery();

  return (
    <div>
      <h1>Admin Product Categories</h1>
      {isSuccess && productCategories && <ProductCategoriesTable data={productCategories} />}
      {isError && <div>Failed to fetch product categories</div>}
    </div>
  );
}
