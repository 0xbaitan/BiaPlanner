import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditProductPage() {
  const { id } = useParams();
  const { data: product } = useGetProductByIdQuery(String(id));
  const [updateProduct, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading }] = useUpdateProductMutation();
  const navigate = useNavigate();

  const { notify: notifyOnUpdateTrigger } = useSimpleStatusToast({
    isError: isUpdateError,
    isLoading,
    isSuccess: isUpdateSuccess,
    successMessage: "Product updated successfully.",
    errorMessage: "Failed to update product.",
    loadingMessage: "Updating product...",
    idPrefix: "product-update",
    onFailure: () => {
      console.error("Failed to update product");
    },
    onSuccess: () => {
      console.log("Product updated successfully");
      navigate(fillParametersInPath(RoutePaths.PRODUCTS_VIEW, { id: String(product?.id) }));
    },
  });

  if (!product) return <div>Could not find product</div>;

  return (
    <ProductForm
      type="update"
      initialValue={product}
      onSubmit={async (dto) => {
        notifyOnUpdateTrigger();
        await updateProduct({
          id: String(product.id),
          dto,
        });
      }}
      disableSubmit={isLoading}
    />
  );
}
