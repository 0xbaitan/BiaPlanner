import Button from "react-bootstrap/esm/Button";
import ProductsTable from "../components/ProductsTable";
import { useGetProductsQuery } from "@/apis/ProductsApi";
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const { data: products, isError, isSuccess } = useGetProductsQuery();

  return (
    <div>
      <h1>Admin Products</h1>
      <NavigateToAddProductPageButton />
      {isSuccess && products && <ProductsTable data={products} />}
      {isError && <div>Failed to fetch products</div>}
    </div>
  );
}

function NavigateToAddProductPageButton() {
  const navigate = useNavigate();
  return <Button onClick={() => navigate("./create")}>Add New Product</Button>;
}
