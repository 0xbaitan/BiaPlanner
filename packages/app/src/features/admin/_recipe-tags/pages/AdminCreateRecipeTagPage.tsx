import { ICreateRecipeTagDto, IRecipeTag } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import RecipeTagForm from "../components/RecipeTagForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateRecipeTagMutation } from "@/apis/RecipeTagsApi";

export default function AdminCreateRecipeTagPage() {
  const [createRecipeTag, { isLoading, isSuccess, isError }] = useCreateRecipeTagMutation();

  const { setItem } = useDefaultStatusToast<IRecipeTag>({
    action: Action.CREATE,
    entityIdentifier: (entity) => entity.name,
    idPrefix: "recipe-tag",
    isError,
    isLoading,
    isSuccess,
    idSelector: (entity) => entity?.id ?? "new",
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectUrl: "/admin/recipe-tags",
      redirectButtonText: "Return to Recipe tags",
    },
  });
  return (
    <div>
      <h1>Create Recipe Tag</h1>

      <RecipeTagForm
        type="create"
        onSubmit={async (dto) => {
          setItem(dto as IRecipeTag);
          await createRecipeTag(dto as ICreateRecipeTagDto);
        }}
      />
    </div>
  );
}
