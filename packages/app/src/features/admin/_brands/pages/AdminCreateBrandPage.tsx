import BrandForm from "../components/BrandForm";
import { ICreateBrandDto } from "@biaplanner/shared";
import { useCreateBrandMutation } from "@/apis/BrandsApi";

export default function AdminCreateBrandPage() {
  const [createBrand, { isError, isSuccess }] = useCreateBrandMutation();
  return (
    <div>
      <h1>Create Brand</h1>
      <BrandForm
        onSubmit={async (brandDto) => {
          await createBrand(brandDto as ICreateBrandDto);
        }}
      />
      {isSuccess ? "Brand created successfully" : ""}
      {isError ? "Error creating brand" : ""}
    </div>
  );
}
