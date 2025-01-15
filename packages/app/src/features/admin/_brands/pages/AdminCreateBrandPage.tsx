import BrandForm from "../components/BrandForm";

export default function AdminCreateBrandPage() {
  return (
    <div>
      <h1>Create Brand</h1>
      <BrandForm onSubmit={(values) => console.log(values)} />
    </div>
  );
}
