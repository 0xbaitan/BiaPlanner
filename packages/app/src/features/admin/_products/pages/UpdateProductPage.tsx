import { useCallback, useState } from "react";
import { useLazyGetProductByIdQuery, useUpdateProductMutation } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import { IProduct } from "@biaplanner/shared";
import ProductForm from "../components/ProductForm";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useUserId } from "@/features/authentication/hooks/useAuthenticationState";

export default function UpdateProductPage() {
  const { id } = useParams();
  const [getProductById] = useLazyGetProductByIdQuery();
  const userId = useUserId();
  const [updateProduct, { isError, isSuccess }] = useUpdateProductMutation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const watchStates = useCallback(async () => {
    const { data } = await getProductById(Number(id));
    if (data) {
      setProduct(data);
    }
  }, [id, getProductById]);

  useAccessTokenChangeWatch(watchStates);
  if (isError) return <div>Failed to update product</div>;
  if (isSuccess) {
    navigate("/admin/products");
  }

  if (!product) return <div>Could not find product</div>;
  return (
    <ProductForm
      initialValues={product}
      onSubmit={async (updatedProduct) => {
        const updatedProductReturned = await updateProduct({ id: Number(id), dto: { ...updatedProduct, createdById: userId, id: Number(id) } });
        console.log("updatedProduct", updatedProductReturned);
      }}
      submitButtonText="Update Product"
    />
  );
}
