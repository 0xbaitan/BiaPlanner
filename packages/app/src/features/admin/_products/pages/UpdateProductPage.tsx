import { useGetProductByIdQuery, useUpdateProductMutation } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { useUserId } from "@/features/authentication/hooks/useAuthenticationState";

export default function UpdateProductPage() {
  const { id } = useParams();
  const { data: product } = useGetProductByIdQuery(Number(id));
  const userId = useUserId();
  const [updateProduct, { isError, isSuccess }] = useUpdateProductMutation();
  const navigate = useNavigate();

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
