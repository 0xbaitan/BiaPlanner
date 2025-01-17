import { ICreateProductDto, IProduct } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { Status } from "@/hooks/useStatusToast";

export default function UpdateProductPage() {
  const { id } = useParams();
  const { data: product } = useGetProductByIdQuery(String(id));

  const [updateProduct, { isError, isSuccess, isLoading }] = useUpdateProductMutation();
  const navigate = useNavigate();

  const { setItem } = useDefaultStatusToast({
    isLoading,
    isError,
    isSuccess,
    action: Action.UPDATE,
    entityIdentifier: (item: IProduct) => item.name,
    redirectContent: {
      redirectButtonText: "Go to Products",
      redirectUrl: "/admin/products",
      applicableStatuses: [Status.SUCCESS],
    },
    idPrefix: "products",
    idSelector: (item) => item?.name ?? "new",
  });
  if (!product) return <div>Could not find product</div>;
  return (
    <div>
      <h1>Update Product</h1>
      <ProductForm
        type="update"
        initialValues={product}
        onSubmit={async (dto) => {
          setItem(dto as IProduct);
          const updatedProduct = await updateProduct({
            id: String(id),
            dto,
          });
          console.log("updatedProduct", updatedProduct);
        }}
        submitButtonText="Update Product"
      />
    </div>
  );
}
