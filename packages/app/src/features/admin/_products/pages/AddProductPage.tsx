import { CreateProductDto } from "@biaplanner/shared";
import ProductForm from "../components/ProductForm";
import { useCreateProductMutation } from "@/apis/ProductsApi";
import { useUserId } from "@/features/authentication/hooks/useAuthenticationState";

export default function AddProductPage() {
  const [createProduct] = useCreateProductMutation();
  const userId = useUserId();
  return (
    <div>
      <h1>Add Product</h1>
      <p>Fill in the form below to add a new product</p>
      <br />
      <ProductForm
        onSubmit={async (values) => {
          await createProduct({ ...values, createdById: userId } as CreateProductDto).unwrap();
          console.log("Product created successfully");
        }}
      />
    </div>
  );
}
