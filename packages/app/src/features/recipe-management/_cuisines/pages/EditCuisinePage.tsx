import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { useGetCuisineQuery, useUpdateCuisineMutation } from "@/apis/CuisinesApi";
import { useNavigate, useParams } from "react-router-dom";

import CuisinesForm from "../components/CuisinesForm";
import { RoutePaths } from "@/Routes";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditCuisinePage() {
  const { id } = useParams();
  const { data: cuisine } = useGetCuisineQuery(String(id));
  const [updateCuisine, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateCuisineMutation();
  const navigate = useNavigate();
  const { notify } = useSimpleStatusToast({
    idPrefix: "update-cuisine",
    successMessage: "Cuisine updated successfully",
    errorMessage: "Failed to update cuisine",
    loadingMessage: "Updating cuisine...",
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    onSuccess: () => {
      console.log("Cuisine updated successfully");
      navigate(RoutePaths.CUISINES);
    },
  });

  if (!cuisine) return <div>Could not find cuisine</div>;

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "cuisine",
        key: "editItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <CuisinesForm
        type="update"
        initialValue={cuisine}
        onSubmit={async (dto) => {
          notify();
          await updateCuisine({ id: String(cuisine?.id), dto });
        }}
        disableSubmit={isUpdateLoading}
      />
    </AuthorisationSieve>
  );
}
