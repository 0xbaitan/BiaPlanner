import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm
        onSubmit={(values) => {
          console.log({ values });
        }}
      />
    </div>
  );
}
