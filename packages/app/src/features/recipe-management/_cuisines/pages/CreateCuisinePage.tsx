import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";

import CuisinesForm from "../components/CuisinesForm";
import { RoutePaths } from "@/Routes";
import { useCreateCuisineMutation } from "@/apis/CuisinesApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateCuisinePage() {
  const [createCuisine, { isLoading, isSuccess, isError }] = useCreateCuisineMutation();
  const navigate = useNavigate();
  const { notify } = useSimpleStatusToast({
    idPrefix: "create-cuisine",
    successMessage: "Cuisine created successfully",
    errorMessage: "Failed to create cuisine",
    loadingMessage: "Creating cuisine...",
    isSuccess,
    isError,
    isLoading,
    onSuccess: () => {
      console.log("Cuisine created successfully");
      navigate(RoutePaths.CUISINES_VIEW);
    },
    onFailure: () => {
      console.error("Failed to create cuisine");
    },
  });

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "cuisine",
        key: "createItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <CuisinesForm
        type="create"
        onSubmit={async (dto) => {
          notify();
          await createCuisine(dto);
        }}
      />
    </AuthorisationSieve>
  );
}
