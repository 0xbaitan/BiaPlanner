import { IProductClassification } from "@biaplanner/shared";
import ProductClassificationTable from "../components/ProductClassificationTable";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetProductClassificationsQuery } from "@/apis/ProductClassificationApi";
import { useState } from "react";
export default function AdminProductCategoriesPage() {
  const [getProductClassifications, { isError, isSuccess }] = useLazyGetProductClassificationsQuery();
  const [productClassifications, setProductClassifications] = useState<IProductClassification[]>([]);

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
      {isSuccess && productClassifications && <ProductClassificationTable data={productClassifications} />}
      {isError && <div>Failed to fetch product categories</div>}
    </div>
  );
}
