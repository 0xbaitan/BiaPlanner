import { useGetBrandQuery, useUpdateBrandMutation } from "@/apis/BrandsApi";

import BrandForm from "../components/BrandForm";
import { IUpdateBrandDto } from "@biaplanner/shared";
import { isSerializedError } from "@/util/checkTypes";
import { useEffect } from "react";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useParams } from "react-router-dom";
import { useSuccessWithRedirectToast } from "@/components/toasts/SuccessWithRedirectToast";

export default function AdminUpdateBrandPage() {
  const { id } = useParams();
  const { data: brand } = useGetBrandQuery(String(id));
  const [updateBrand, { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateBrandMutation();

  const { notify: notifyOnSuccess, setPauseNotificationStatus } = useSuccessWithRedirectToast({
    redirectUrl: "/admin/brands",
    message: `Successfully updated the brand which was named ${brand?.name}`,
    redirectButtonText: "Return to Brands",
  });

  const { notify: notifyOnError } = useErrorToast({ error: `Failed to update the brand. \n Cause: ${isSerializedError(updateError) ? updateError.message : "Unknown error"}` });

  useEffect(() => {
    if (isUpdateSuccess) {
      notifyOnSuccess();
      setPauseNotificationStatus(true);
    } else if (isUpdateError) {
      notifyOnError();
    }
  }, [isUpdateError, isUpdateSuccess, notifyOnError, notifyOnSuccess, setPauseNotificationStatus]);

  console.log("brand", brand);
  if (!brand) return <div>Could not find brand</div>;
  return (
    <BrandForm
      type="update"
      initialValue={brand}
      onSubmit={async (brandDto) => {
        setPauseNotificationStatus(false);
        await updateBrand(brandDto as IUpdateBrandDto);
      }}
    />
  );
}
