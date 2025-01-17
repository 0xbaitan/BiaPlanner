import Button from "react-bootstrap/esm/Button";
import ProductCategoriesTable from "../components/ProductCategoriesTable";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useNavigate } from "react-router-dom";

export default function AdminProductCategoriesPage() {
  const { data: productCategories, isSuccess, isError } = useGetProductCategoriesQuery();

  return (
    <div>
      <h1>Product Categories</h1>
      <NavigateToCreateProductCategoryPage />
      {isSuccess && productCategories && <ProductCategoriesTable data={productCategories} />}
      {isError && <div>Failed to fetch product categories</div>}
    </div>
  );
}

function NavigateToCreateProductCategoryPage() {
  const navigate = useNavigate();

  return <Button onClick={() => navigate("./create")}>Create Product Category</Button>;
}
