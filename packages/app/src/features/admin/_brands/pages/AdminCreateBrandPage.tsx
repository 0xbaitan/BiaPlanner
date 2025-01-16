import BrandForm from "../components/BrandForm";
import { ICreateBrandDto } from "@biaplanner/shared";
import { useCreateBrandMutation } from "@/apis/BrandsApi";
import { useEffect } from "react";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useLoadingToast } from "@/components/toasts/LoadingToast";
import { useSuccessWithRedirectToast } from "@/components/toasts/SuccessWithRedirectToast";

export default function AdminCreateBrandPage() {
  const [createBrand, { isError, isSuccess, isLoading, data: createdBrand, error }] = useCreateBrandMutation();
  const { notify: notifyOnSuccess } = useSuccessWithRedirectToast({
    redirectUrl: "/admin/brands",
    message: `Successfully created a brand named ${createdBrand?.name}`,
    redirectButtonText: "Return to Brands",
  });

  const { notify: notifyOnError } = useErrorToast({ error });

  const { notify: notifyOnLoading } = useLoadingToast({
    message: "Creating brand...",
  });

  useEffect(() => {
    if (isSuccess) {
      notifyOnSuccess();
    } else if (isError) {
      notifyOnError();
    } else if (isLoading) {
      notifyOnLoading();
    }
  }, [isSuccess, isError, createBrand, notifyOnSuccess, notifyOnError, isLoading, notifyOnLoading]);

  return (
    <div>
      <h1>Create Brand</h1>
      <BrandForm
        type="create"
        disableSubmit={isLoading}
        onSubmit={async (brandDto) => {
          await createBrand(brandDto as ICreateBrandDto);
        }}
      />
    </div>
  );
}
