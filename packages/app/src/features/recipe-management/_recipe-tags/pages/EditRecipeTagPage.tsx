import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { useGetRecipeTagQuery, useUpdateRecipeTagMutation } from "@/apis/RecipeTagsApi";
import { useNavigate, useParams } from "react-router-dom";

import GenericSinglePaneFormPage from "@/pages/GenericSinglePaneFormPage";
import RecipeTagForm from "../components/RecipeTagForm";
import { RoutePaths } from "@/Routes";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditRecipeTagPage() {
  const { id } = useParams();
  const { data: recipeTag, isLoading, isError } = useGetRecipeTagQuery(String(id));
  const [updateRecipeTag, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateRecipeTagMutation();
  const navigate = useNavigate();
  const { notify } = useSimpleStatusToast({
    idPrefix: "update-recipe-tag",
    successMessage: "Recipe tag updated successfully",
    errorMessage: "Failed to update recipe tag",
    loadingMessage: "Updating recipe tag...",
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    onSuccess: () => {
      console.log("Recipe tag updated successfully");
      navigate(RoutePaths.RECIPE_TAGS);
    },
  });

  if (isLoading) {
    return <EditRecipePageLoading />;
  }

  if (isError || !recipeTag) {
    return <EditRecipePageError />;
  }

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "recipeTag",
        key: "editItem",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <RecipeTagForm
        type="update"
        initialValue={recipeTag}
        onSubmit={async (dto) => {
          notify();
          await updateRecipeTag({ id: String(recipeTag?.id), dto });
        }}
        disableSubmit={isUpdateLoading}
      />
    </AuthorisationSieve>
  );
}

function EditRecipePageLoading() {
  return <GenericSinglePaneFormPage isLoading={true} headerTitle="Loading..." headerActions={<></>} paneContent={<div>Loading...</div>} />;
}

function EditRecipePageError() {
  return <GenericSinglePaneFormPage isLoading={false} headerTitle="Error" headerActions={<></>} paneContent={<div>Error loading recipe tag</div>} />;
}
