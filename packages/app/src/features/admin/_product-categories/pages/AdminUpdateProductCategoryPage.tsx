import { IProductCategory, IUpdateProductCategoryDto } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetProductCategoryQuery, useUpdateProductCategoryMutation } from "@/apis/ProductCategoryApi";

import ProductCategoryForm from "../components/ProductCategoryForm";
import { Status } from "@/hooks/useStatusToast";
import { useGetProductByIdQuery } from "@/apis/ProductsApi";
import { useParams } from "react-router-dom";
import { useUpdateBrandMutation } from "@/apis/BrandsApi";

export default function AdminUpdateProductCategoryPage() {
  const { id } = useParams();
  const { data: productCategory } = useGetProductCategoryQuery(String(id));
  const [updateProductCategory, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateProductCategoryMutation();

  const { setItem } = useDefaultStatusToast<IProductCategory>({
    idSelector: (productCategory) => productCategory.id,
    action: Action.UPDATE,
    entityIdentifier: (productCategory) => productCategory.name,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    idPrefix: "product-category",
    isLoading: isUpdateLoading,
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Return to Product Categories",
      redirectUrl: "/admin/product-categories",
    },
  });

  return (
    <div>
      <h2>Update Product Category</h2>
      {productCategory ? (
        <ProductCategoryForm
          type="update"
          initialValue={productCategory}
          onSubmit={async (productCategoryDto) => {
            setItem(productCategoryDto as IProductCategory);
            await updateProductCategory(productCategoryDto as IUpdateProductCategoryDto);
          }}
          disableSubmit={isUpdateLoading}
        />
      ) : (
        <div>Could not find product category</div>
      )}
    </div>
  );
}
