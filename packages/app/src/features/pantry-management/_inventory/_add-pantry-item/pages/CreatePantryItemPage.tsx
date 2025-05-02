import CreatePantryItemForm from "../components/CreatePantryItemForm";
import { RoutePaths } from "@/Routes";
import { useCreatePantryItemMutation } from "@/apis/PantryItemsApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreatePantryItemPage() {
  const navigate = useNavigate();
  const [createPantryItem, { isSuccess, isError, isLoading }] = useCreatePantryItemMutation();

  const { notify: notifyOnCreateTrigger } = useSimpleStatusToast({
    isError,
    isLoading,
    isSuccess,
    successMessage: "Pantry item added successfully.",
    errorMessage: "Failed to add pantry item.",
    loadingMessage: "Adding pantry item...",
    idPrefix: "pantry-item-create",
    onFailure: () => {
      console.error("Failed to add pantry item");
    },
    onSuccess: () => {
      console.log("Pantry item added successfully");
      navigate(RoutePaths.PANTRY);
    },
  });

  return (
    <CreatePantryItemForm
      disableSubmit={isLoading}
      onSubmit={async (pantryItemDto) => {
        notifyOnCreateTrigger();
        await createPantryItem(pantryItemDto);
      }}
    />
  );
}
