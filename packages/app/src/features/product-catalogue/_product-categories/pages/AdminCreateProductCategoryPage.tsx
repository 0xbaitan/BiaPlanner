import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IProductCategory } from "@biaplanner/shared";
import ProductCategoryForm from "../components/ProductCategoryForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateProductCategoryMutation } from "@/apis/ProductCategoryApi";

export default function AdminCreateProductCategoryPage() {
  const [createProductCategory, { isLoading, isSuccess, isError }] = useCreateProductCategoryMutation();

  const { setItem } = useDefaultStatusToast<IProductCategory>({
    action: Action.CREATE,
    entityIdentifier: (entity) => entity.name,
    idPrefix: "product-category",
    isError,
    isLoading,
    isSuccess,
    idSelector: (entity) => entity?.id ?? "new",
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectUrl: "/admin/product-categories",
      redirectButtonText: "Return to Product Categories",
    },
  });
  return (
    <div>
      <h1>Create Product Category</h1>

      <ProductCategoryForm
        type="create"
        onSubmit={async (productCategoryDto) => {
          setItem(productCategoryDto as IProductCategory);
          await createProductCategory(productCategoryDto as IProductCategory);
        }}
      />
    </div>
  );
}
