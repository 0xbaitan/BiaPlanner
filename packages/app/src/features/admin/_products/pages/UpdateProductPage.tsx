import { useGetProductByIdQuery, useUpdateProductMutation } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";

export default function UpdateProductPage() {
  const { id } = useParams();
  const { data: product } = useGetProductByIdQuery(String(id));

  const [updateProduct, { isError, isSuccess }] = useUpdateProductMutation();
  const navigate = useNavigate();

  if (isError) return <div>Failed to update product</div>;
  if (isSuccess) {
    navigate("/admin/products");
  }

  if (!product) return <div>Could not find product</div>;
  return (
    <ProductForm
      type="update"
      initialValues={product}
      onSubmit={async (dto) => {
        const updatedProduct = await updateProduct({
          id: String(id),
          dto,
        });
        console.log("updatedProduct", updatedProduct);
      }}
      submitButtonText="Update Product"
    />
  );
}
