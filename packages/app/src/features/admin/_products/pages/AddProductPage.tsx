import { ICreateProductDto } from "@biaplanner/shared";
import ProductForm from "../components/ProductForm";
import { useCreateProductMutation } from "@/apis/ProductsApi";
import { useNavigate } from "react-router-dom";

export default function AddProductPage() {
  const [createProduct, { isError, isSuccess }] = useCreateProductMutation();
  const navigate = useNavigate();

  if (isError) return <div>Failed to create product</div>;
  if (isSuccess) {
    console.log("Product created successfully");
    navigate("/admin/products");
  }
  return (
    <div>
      <h1>Add Product</h1>
      <p>Fill in the form below to add a new product</p>
      <br />
      <ProductForm
        type="create"
        onSubmit={async (dto) => {
          await createProduct(dto as ICreateProductDto);
          console.log("Product created successfully");
        }}
      />
    </div>
  );
}
