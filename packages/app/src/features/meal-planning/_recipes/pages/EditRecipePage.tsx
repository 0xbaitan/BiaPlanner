import { IRecipe, IRecipeTag, IUpdateRecipeTagDto, IWriteRecipeDto } from "@biaplanner/shared";
import { useCallback, useEffect, useMemo } from "react";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetRecipeQuery, useUpdateRecipeMutation } from "@/apis/RecipeApi";
import { useGetRecipeTagQuery, useUpdateRecipeTagMutation } from "@/apis/RecipeTagsApi";
import { useNavigate, useParams } from "react-router-dom";

import RecipeForm from "../components/RecipeForm";
import { Status } from "@/hooks/useStatusToast";

export default function EditRecipePage() {
  const { id } = useParams();
  const { data: recipe, isLoading: isReadLoading, isError: isReadError } = useGetRecipeQuery(String(id));
  const [updateRecipe, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateRecipeMutation();
  const navigate = useNavigate();
  const { setItem } = useDefaultStatusToast<IRecipe>({
    idSelector: (entity) => entity.id,
    action: Action.UPDATE,
    entityIdentifier: (entity) => entity.title,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    idPrefix: "recipe",
    isLoading: isUpdateLoading,
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Return to Recipes",
      redirectUrl: "/meal-planning/recipes",
    },
  });

  useEffect(() => {
    if (isUpdateSuccess) {
      navigate(-1);
    }
  }, [isUpdateSuccess, navigate]);

  const handleUpdateRecipeSubmission = useCallback(
    async (dto: IWriteRecipeDto) => {
      if (!id) {
        console.error("No ID provided for recipe update");
        return false;
      }
      console.log("Updating recipe with ID:", id, "and DTO:", dto);
      setItem(dto as IRecipe);
      try {
        await updateRecipe({ id, dto }).unwrap();
        return true;
      } catch (error) {
        console.error("Error updating recipe:", error);
        return false;
      }
    },
    [id, updateRecipe, setItem]
  );

  if (isReadLoading) {
    return <div>Loading...</div>;
  }

  if (isReadError) {
    return <div>Error loading recipe</div>;
  }

  if (!recipe) {
    return <div>Could not find the recipe</div>;
  }

  return <div>{recipe ? <RecipeForm type="update" initialValue={recipe} onSubmit={handleUpdateRecipeSubmission} disableSubmit={isUpdateLoading} /> : <div>Could not find the recipe</div>}</div>;
}
