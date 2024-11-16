import { IProductCategory } from "@biaplanner/shared";
import ProductCategoriesTable from "../components/ProductCategoriesTable";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useState } from "react";
export default function AdminProductCategoriesPage() {
  const [getProductClassifications, { isError, isSuccess }] = useLazyGetProductCategoriesQuery();
  const [productClassifications, setProductClassifications] = useState<IProductCategory[]>([]);

  useAccessTokenChangeWatch(async () => {
    const { data } = await getProductClassifications({});
    if (data) {
      setProductClassifications(data);
    } else {
      setProductClassifications([]);
    }
  });

  return (
    <div>
      <h1>Admin Product Categories</h1>
      {isSuccess && productClassifications && <ProductCategoriesTable data={productClassifications} />}
      {isError && <div>Failed to fetch product categories</div>}
    </div>
  );
}
