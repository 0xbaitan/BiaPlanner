import { IRecipeTag, IUpdateRecipeTagDto } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetRecipeTagQuery, useUpdateRecipeTagMutation } from "@/apis/RecipeTagsApi";

import RecipeTagForm from "../components/RecipeTagForm";
import { Status } from "@/hooks/useStatusToast";
import { useParams } from "react-router-dom";

export default function AdminUpdateRecipeTagPage() {
  const { id } = useParams();
  const { data: recipeTag } = useGetRecipeTagQuery(String(id));
  const [updateRecipeTag, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateRecipeTagMutation();

  const { setItem } = useDefaultStatusToast<IRecipeTag>({
    idSelector: (entity) => entity.id,
    action: Action.UPDATE,
    entityIdentifier: (entity) => entity.name,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    idPrefix: "recipe-tag",
    isLoading: isUpdateLoading,
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Return to Recipe tags",
      redirectUrl: "/admin/recipe-tags",
    },
  });

  return (
    <div>
      <h2>Update Recipe Tag</h2>
      {recipeTag ? (
        <RecipeTagForm
          type="update"
          initialValue={recipeTag}
          onSubmit={async (dto) => {
            setItem(dto as IRecipeTag);
            await updateRecipeTag(dto as IUpdateRecipeTagDto);
          }}
          disableSubmit={isUpdateLoading}
        />
      ) : (
        <div>Could not find the recipe tag</div>
      )}
    </div>
  );
}
