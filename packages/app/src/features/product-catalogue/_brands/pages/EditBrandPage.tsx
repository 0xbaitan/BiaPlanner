import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useGetBrandQuery, useUpdateBrandMutation } from "@/apis/BrandsApi";
import { useNavigate, useParams } from "react-router-dom";

import BrandForm from "../components/BrandForm";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditBrandPage() {
  const { id } = useParams();
  const { data: brand } = useGetBrandQuery(String(id));
  const [updateBrand, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading }] = useUpdateBrandMutation();
  const navigate = useNavigate();
  const { notify: notifyOnUpdateTrigger } = useSimpleStatusToast({
    isError: isUpdateError,
    isLoading,
    isSuccess: isUpdateSuccess,
    successMessage: "Brand updated successfully.",
    errorMessage: "Failed to update brand.",
    loadingMessage: "Updating brand...",
    idPrefix: "brand-update",
    onFailure: () => {
      console.error("Failed to update brand");
    },
    onSuccess: () => {
      console.log("Brand updated successfully");
      navigate(fillParametersInPath(RoutePaths.BRANDS_VIEW, { id: String(brand?.id) }));
    },
  });

  console.log("brand", brand);
  if (!brand) return <div>Could not find brand</div>;
  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "brand",
        key: "createItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <BrandForm
        type="update"
        initialValue={brand}
        onSubmit={async (brandDto) => {
          notifyOnUpdateTrigger();
          await updateBrand({ id: String(brand.id), dto: brandDto });
        }}
      />
    </AuthorisationSieve>
  );
}
