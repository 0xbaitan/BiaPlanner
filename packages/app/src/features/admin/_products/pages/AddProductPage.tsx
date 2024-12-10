import { CreateProductDto } from "@biaplanner/shared";
import ProductForm from "../components/ProductForm";
import { useCreateProductMutation } from "@/apis/ProductsApi";

export default function AddProductPage() {
  const [createProduct] = useCreateProductMutation();
  return (
    <div>
      <h1>Add Product</h1>
      <p>Fill in the form below to add a new product</p>
      <br />
      <ProductForm
        onSubmit={async (values) => {
          await createProduct(values as CreateProductDto).unwrap();
          console.log("Product created successfully");
        }}
      />
    </div>
  );
}
