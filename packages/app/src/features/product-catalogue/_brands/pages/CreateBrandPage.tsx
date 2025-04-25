import { RoutePaths, fillParametersInPath } from "@/Routes";

import BrandForm from "../components/BrandForm";
import { useCreateBrandMutation } from "@/apis/BrandsApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateBrandPage() {
  const navigate = useNavigate();
  const [createBrand, { isSuccess, isError, isLoading, data }] = useCreateBrandMutation();

  const { notify: notifyOnCreateTrigger } = useSimpleStatusToast({
    isError,
    isLoading,
    isSuccess,
    successMessage: "Brand created successfully.",
    errorMessage: "Failed to create brand.",
    loadingMessage: "Creating brand...",
    idPrefix: "brand-create",
    onFailure: () => {
      console.error("Failed to create brand");
    },
    onSuccess: () => {
      console.log("Brand created successfully");
      navigate(fillParametersInPath(RoutePaths.BRANDS_VIEW, { id: String(data?.id) }));
    },
  });

  return (
    <BrandForm
      type="create"
      disableSubmit={isLoading}
      onSubmit={async (brandDto) => {
        notifyOnCreateTrigger();
        await createBrand(brandDto);
      }}
    />
  );
}
