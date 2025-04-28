import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useGetRecipeQuery, useUpdateRecipeMutation } from "@/apis/RecipeApi";
import { useNavigate, useParams } from "react-router-dom";

import { IWriteRecipeDto } from "@biaplanner/shared";
import RecipeForm from "../components/RecipeForm";
import { useCallback } from "react";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditRecipePage() {
  const { id } = useParams();
  const { data: recipe, isLoading: isReadLoading } = useGetRecipeQuery(String(id));
  const [updateRecipe, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateRecipeMutation();
  const navigate = useNavigate();

  const { notify: notifyOnUpdateTrigger } = useSimpleStatusToast({
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    successMessage: "Recipe updated successfully.",
    errorMessage: "Failed to update recipe.",
    loadingMessage: "Updating recipe...",
    idPrefix: "recipe-update",
    onFailure: () => {
      console.error("Failed to update recipe");
    },
    onSuccess: () => {
      console.log("Recipe updated successfully");
      navigate(fillParametersInPath(RoutePaths.RECIPES_VIEW, { id: String(recipe?.id) }));
    },
  });

  const handleUpdateRecipeSubmission = useCallback(
    async (dto: IWriteRecipeDto, formData: FormData) => {
      if (!id) {
        console.error("No ID provided for recipe update");
        return false;
      }
      console.log("Updating recipe with ID:", id, "and DTO:", dto);
      notifyOnUpdateTrigger();
      try {
        await updateRecipe({ id, formData }).unwrap();
        return true;
      } catch (error) {
        console.error("Error updating recipe:", error);
        return false;
      }
    },
    [id, updateRecipe, notifyOnUpdateTrigger]
  );

  if (isReadLoading) {
    return <div>Loading...</div>;
  }

  return <div>{recipe ? <RecipeForm type="update" initialValue={recipe} onSubmit={handleUpdateRecipeSubmission} disableSubmit={isUpdateLoading} /> : <div>Could not find the recipe</div>}</div>;
}
