import { IBrand, IUpdateBrandDto } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetBrandQuery, useUpdateBrandMutation } from "@/apis/BrandsApi";

import BrandForm from "../components/BrandForm";
import { Status } from "@/hooks/useStatusToast";
import { useParams } from "react-router-dom";

export default function EditBrandPage() {
  const { id } = useParams();
  const { data: brand } = useGetBrandQuery(String(id));
  const [updateBrand, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading }] = useUpdateBrandMutation();

  const { setItem } = useDefaultStatusToast<IBrand>({
    idSelector: (brand) => brand.id,
    action: Action.UPDATE,
    entityIdentifier: (brand) => brand.name,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    idPrefix: "brand",
    isLoading,
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Return to Brands",
      redirectUrl: "/admin/brands",
    },
  });

  console.log("brand", brand);
  if (!brand) return <div>Could not find brand</div>;
  return (
    <BrandForm
      type="update"
      initialValue={brand}
      onSubmit={async (brandDto) => {
        // setPauseNotificationStatus(false);
        setItem(brandDto as IBrand);
        await updateBrand(brandDto as IUpdateBrandDto);
      }}
    />
  );
}
