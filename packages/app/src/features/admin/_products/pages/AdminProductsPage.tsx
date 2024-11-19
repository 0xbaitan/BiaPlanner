import { useCallback, useState } from "react";
import { useGetProductsQuery, useLazyGetProductsQuery } from "@/apis/ProductsApi";

import Button from "react-bootstrap/esm/Button";
import { IProduct } from "@biaplanner/shared";
import ProductsTable from "../components/ProductsTable";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [getProducts, { isError, isSuccess }] = useLazyGetProductsQuery();
  const [products, setProducts] = useState<IProduct[]>([]);

  useAccessTokenChangeWatch(async () => {
    const { data } = await getProducts({});
    if (data) {
      setProducts(data);
    }
  });

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
  return <Button onClick={() => navigate("./add-product")}>Add New Product</Button>;
}
