import { RoutePaths, fillParametersInPath } from "@/Routes";

import ProductForm from "../components/ProductForm";
import { useCreateProductMutation } from "@/apis/ProductsApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [createProduct, { isSuccess, isError, isLoading, data }] = useCreateProductMutation();

  const { notify: notifyOnCreateTrigger } = useSimpleStatusToast({
    isError,
    isLoading,
    isSuccess,
    successMessage: "Product created successfully.",
    errorMessage: "Failed to create product.",
    loadingMessage: "Creating product...",
    idPrefix: "product-create",
    onFailure: () => {
      console.error("Failed to create product");
    },
    onSuccess: () => {
      console.log("Product created successfully");
      navigate(fillParametersInPath(RoutePaths.PRODUCTS_VIEW, { id: String(data?.id) }));
    },
  });

  return (
    <ProductForm
      type="create"
      disableSubmit={isLoading}
      onSubmit={async (productDto) => {
        notifyOnCreateTrigger();
        await createProduct(productDto);
      }}
    />
  );
}
