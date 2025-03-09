import { ICreateRecipeDto, IRecipe } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import RecipeForm from "../components/RecipeForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateRecipeMutation } from "@/apis/RecipeApi";

export default function CreateRecipePage() {
  const [createRecipeMutation, { isLoading, isError, isSuccess }] = useCreateRecipeMutation();

  const { setItem } = useDefaultStatusToast<IRecipe>({
    action: Action.CREATE,
    entityIdentifier: (entity) => entity.title,
    idPrefix: "recipes",
    isError,
    isLoading,
    isSuccess,
    idSelector: (entity) => entity?.id ?? "new",
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectUrl: "/meal-planning/recipes",
      redirectButtonText: "Return to recipes",
    },
  });

  return (
    <div>
      <RecipeForm
        type="create"
        onSubmit={async (values) => {
          setItem(values as IRecipe);
          await createRecipeMutation(values as ICreateRecipeDto);
        }}
      />
    </div>
  );
}
