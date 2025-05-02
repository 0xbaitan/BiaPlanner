import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IWriteRecipeDto } from "@biaplanner/shared";
import RecipeForm from "../components/RecipeForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateRecipeMutation } from "@/apis/RecipeApi";

export default function CreateRecipePage() {
  const [createRecipeMutation, { isLoading, isError, isSuccess }] = useCreateRecipeMutation();

  const { setItem } = useDefaultStatusToast<IWriteRecipeDto>({
    action: Action.CREATE,
    entityIdentifier: (entity) => entity.title,
    idPrefix: "recipes",
    isError,
    isLoading,
    isSuccess,
    idSelector: (entity) => "new",
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectUrl: "/meal-planning/recipes",
      redirectButtonText: "Return to recipes",
    },
  });

  const handleCreateRecipeSubmission = async (dto: IWriteRecipeDto) => {
    console.log("Creating recipe with DTO:", dto);
    setItem(dto);
    try {
      await createRecipeMutation(dto).unwrap();
      return true;
    } catch (error) {
      console.error("Error creating recipe:", error);
      return false;
    }
  };

  return (
    <div>
      <RecipeForm type="create" onSubmit={handleCreateRecipeSubmission} />
    </div>
  );
}
