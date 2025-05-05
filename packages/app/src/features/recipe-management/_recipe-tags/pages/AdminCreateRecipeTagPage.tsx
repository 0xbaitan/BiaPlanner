import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";

import RecipeTagForm from "../components/RecipeTagForm";
import { RoutePaths } from "@/Routes";
import { useCreateRecipeTagMutation } from "@/apis/RecipeTagsApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function AdminCreateRecipeTagPage() {
  const [createRecipeTag, { isLoading, isSuccess, isError }] = useCreateRecipeTagMutation();

  const navigate = useNavigate();
  const { notify } = useSimpleStatusToast({
    idPrefix: "create-recipe-tag",
    successMessage: "Recipe tag created successfully",
    errorMessage: "Failed to create recipe tag",
    loadingMessage: "Creating recipe tag...",
    isSuccess,
    isError,
    isLoading,
    onSuccess: () => {
      console.log("Recipe tag created successfully");
      navigate(RoutePaths.RECIPE_TAGS);
    },
    onFailure: () => {
      console.error("Failed to create recipe tag");
    },
  });
  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "recipeTag",
        key: "createItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <RecipeTagForm
        type="create"
        onSubmit={async (dto) => {
          notify();
          await createRecipeTag(dto);
        }}
      />
    </AuthorisationSieve>
  );
}
