import { IRecipe, IRecipeTag, IUpdateRecipeDto, IUpdateRecipeTagDto } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetRecipeQuery, useUpdateRecipeMutation } from "@/apis/RecipeApi";
import { useGetRecipeTagQuery, useUpdateRecipeTagMutation } from "@/apis/RecipeTagsApi";

import RecipeForm from "../components/RecipeForm";
import { Status } from "@/hooks/useStatusToast";
import { useParams } from "react-router-dom";

export default function UpdateRecipePage() {
  const { id } = useParams();
  const { data: recipe } = useGetRecipeQuery(String(id));
  const [updateRecipe, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateRecipeMutation();

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

  return (
    <div>
      <h2>Update Recipe</h2>
      {recipe ? (
        <RecipeForm
          type="update"
          initialValue={recipe}
          onSubmit={async (dto) => {
            setItem(dto as IRecipe);
            await updateRecipe(dto as IUpdateRecipeDto);
          }}
          disableSubmit={isUpdateLoading}
        />
      ) : (
        <div>Could not find the recipe</div>
      )}
    </div>
  );
}
