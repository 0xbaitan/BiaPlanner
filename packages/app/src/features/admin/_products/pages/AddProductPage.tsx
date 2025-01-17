import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { ICreateProductDto } from "@biaplanner/shared";
import ProductForm from "../components/ProductForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateProductMutation } from "@/apis/ProductsApi";
import { useNavigate } from "react-router-dom";

export default function AddProductPage() {
  const [createProduct, { isError, isSuccess, isLoading }] = useCreateProductMutation();
  const navigate = useNavigate();

  const { setItem } = useDefaultStatusToast({
    isLoading,
    isError,
    isSuccess,
    action: Action.CREATE,
    entityIdentifier: (item: ICreateProductDto) => item.name,
    redirectContent: {
      redirectButtonText: "Go to Products",
      redirectUrl: "/admin/products",
      applicableStatuses: [Status.SUCCESS],
    },
    idPrefix: "products",
    idSelector: (item) => item?.name ?? "new",
  });

  return (
    <div>
      <h1>Add Product</h1>
      <p>Fill in the form below to add a new product</p>
      <br />
      <ProductForm
        type="create"
        onSubmit={async (dto) => {
          setItem(dto as ICreateProductDto);
          await createProduct(dto as ICreateProductDto);
          console.log("Product created", dto);
        }}
      />
    </div>
  );
}
