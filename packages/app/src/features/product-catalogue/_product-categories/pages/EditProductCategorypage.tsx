import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { useGetProductCategoryQuery, useUpdateProductCategoryMutation } from "@/apis/ProductCategoryApi";
import { useNavigate, useParams } from "react-router-dom";

import ProductCategoryForm from "../components/ProductCategoryForm";
import { RoutePaths } from "@/Routes";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditProductCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productCategory } = useGetProductCategoryQuery(String(id));
  const [updateProductCategory, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateProductCategoryMutation();

  const { notify: notifyOnUpdateTrigger } = useSimpleStatusToast({
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    successMessage: "Product category updated successfully.",
    errorMessage: "Failed to update product category.",
    loadingMessage: "Updating product category...",
    idPrefix: "product-category-update",
    onFailure: () => {
      console.error("Failed to update product category");
    },
    onSuccess: () => {
      console.log("Product category updated successfully");
      navigate(RoutePaths.PRODUCT_CATEGORIES);
    },
  });

  if (!productCategory) return <div>Could not find product category</div>;

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "productCategory",
        key: "editItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <ProductCategoryForm
        type="update"
        initialValue={productCategory}
        onSubmit={async (productCategoryDto) => {
          notifyOnUpdateTrigger();
          await updateProductCategory({
            id: productCategory.id,
            dto: productCategoryDto,
          });
        }}
        disableSubmit={isUpdateLoading}
      />
    </AuthorisationSieve>
  );
}
