import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { IWriteRecipeDto } from "@biaplanner/shared";
import RecipeForm from "../components/RecipeForm";
import { useCallback } from "react";
import { useCreateRecipeMutation } from "@/apis/RecipeApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const [createRecipe, { isSuccess, isError, isLoading, data }] = useCreateRecipeMutation();

  const { notify: notifyOnCreateTrigger } = useSimpleStatusToast({
    isError,
    isLoading,
    isSuccess,
    successMessage: "Recipe created successfully.",
    errorMessage: "Failed to create recipe.",
    loadingMessage: "Creating recipe...",
    idPrefix: "recipe-create",
    onFailure: () => {
      console.error("Failed to create recipe");
    },
    onSuccess: () => {
      console.log("Recipe created successfully");
      navigate(fillParametersInPath(RoutePaths.RECIPES_VIEW, { id: String(data?.id) }));
    },
  });

  const handleCreateRecipeSubmission = useCallback(
    async (dto: IWriteRecipeDto, formData: FormData) => {
      console.log("Creating recipe with DTO:", dto);
      notifyOnCreateTrigger();
      try {
        await createRecipe(formData).unwrap();
        return true;
      } catch (error) {
        console.error("Error creating recipe:", error);
        return false;
      }
    },
    [createRecipe, notifyOnCreateTrigger]
  );

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "recipe",
        key: "createItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <RecipeForm type="create" onSubmit={handleCreateRecipeSubmission} disableSubmit={isLoading} />
    </AuthorisationSieve>
  );
}
