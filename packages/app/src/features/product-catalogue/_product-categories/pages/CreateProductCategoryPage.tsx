import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";

import ProductCategoryForm from "../components/ProductCategoryForm";
import { RoutePaths } from "@/Routes";
import { useCreateProductCategoryMutation } from "@/apis/ProductCategoryApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateProductCategoryPage() {
  const [createProductCategory, { isLoading, isSuccess, isError }] = useCreateProductCategoryMutation();
  const navigate = useNavigate();

  const { notify } = useSimpleStatusToast({
    idPrefix: "create-product-category",
    successMessage: "Product category created successfully",
    errorMessage: "Failed to create product category",
    loadingMessage: "Creating product category...",
    isSuccess,
    isError,
    isLoading,
    onSuccess: () => {
      console.log("Product category created successfully");
      navigate(RoutePaths.PRODUCT_CATEGORIES);
    },
    onFailure: () => {
      console.error("Failed to create product category");
    },
  });

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "productCategory",
        key: "createItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <ProductCategoryForm
        type="create"
        onSubmit={async (productCategoryDto) => {
          notify();
          await createProductCategory(productCategoryDto);
        }}
        disableSubmit={isLoading}
      />
    </AuthorisationSieve>
  );
}
