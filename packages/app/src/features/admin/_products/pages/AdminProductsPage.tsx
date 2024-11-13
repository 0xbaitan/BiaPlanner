import { useCallback, useState } from "react";
import { useGetProductsQuery, useLazyGetProductsQuery } from "@/apis/ProductsApi";

import { IProduct } from "@biaplanner/shared";
import ProductsTable from "../../components/ProductsTable";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";

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
      {isSuccess && products && <ProductsTable data={products} />}
      {isError && <div>Failed to fetch products</div>}
    </div>
  );
}
