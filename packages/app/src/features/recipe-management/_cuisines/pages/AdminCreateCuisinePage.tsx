import CuisinesForm from "../components/CuisinesForm";
import { RoutePaths } from "@/Routes";
import { useCreateCuisineMutation } from "@/apis/CuisinesApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function AdminCreateCuisinePage() {
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
    <CuisinesForm
      type="create"
      onSubmit={async (dto) => {
        notify();
        await createCuisine(dto);
      }}
    />
  );
}
