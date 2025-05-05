import "../styles/ViewMealPlanPage.scss";

import { FaEdit, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useDeleteConcreteRecipeMutation, useGetConcreteRecipeQuery } from "@/apis/ConcreteRecipeApi";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "@/components/Alert";
import Button from "react-bootstrap/Button";
import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import Heading from "@/components/Heading";
import { IConcreteRecipe } from "@biaplanner/shared";
import Pill from "@/components/Pill";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function ViewMealPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: mealPlan,
    isLoading,
    isError,
  } = useGetConcreteRecipeQuery(String(id), {
    refetchOnMountOrArgChange: true,
  });

  const [deleteMealPlan, { isError: isDeletionFailure, isLoading: isDeletionPending, isSuccess: isDeletionSuccess }] = useDeleteConcreteRecipeMutation();

  const { notify: notifyOnDeletion } = useSimpleStatusToast({
    isError: isDeletionFailure,
    isLoading: isDeletionPending,
    isSuccess: isDeletionSuccess,
    successMessage: "Meal plan deleted successfully.",
    errorMessage: "Failed to delete meal plan.",
    loadingMessage: "Deleting meal plan...",
    idPrefix: "meal-plan-deletion",
    onSuccess: () => {
      navigate(RoutePaths.MEAL_PLANS);
    },
  });

  const { notify: notifyDeletion } = useDeletionToast<IConcreteRecipe>({
    identifierSelector: (item) => item.recipe?.title ?? "this meal plan",
    onConfirm: async (item) => {
      notifyOnDeletion();
      await deleteMealPlan(item.id);
    },
  });

  const handleDeleteMealPlan = useCallback(() => {
    mealPlan && notifyDeletion(mealPlan);
  }, [mealPlan, notifyDeletion]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !mealPlan) return <div>Error loading meal plan details.</div>;

  return (
    <CrudViewPageLayout
      breadcrumbs={[
        {
          label: "Meal Plans",
          href: RoutePaths.MEAL_PLANS,
        },
        {
          label: `${mealPlan.recipe?.title ?? "Meal Plan"}`,
          href: fillParametersInPath(RoutePaths.MEAL_PLANS_VIEW, { id: mealPlan.id }),
        },
      ]}
      title={mealPlan.recipe?.title ?? "Meal Plan"}
      actions={
        <div className="bp-meal_plan_view__actions">
          <Button variant="primary" onClick={() => navigate(fillParametersInPath(RoutePaths.MEAL_PLANS_EDIT, { id: mealPlan.id }))}>
            <FaEdit />
            &ensp;Edit Meal Plan
          </Button>
          <Button variant="danger" onClick={handleDeleteMealPlan}>
            <FaTrash />
            &ensp;Delete Meal Plan
          </Button>
        </div>
      }
    >
      <div className="bp-meal_plan_view__details_container">
        <div className="bp-meal_plan_view__image_container">
          {mealPlan.recipe?.coverImage ? <img src={getImagePath(mealPlan.recipe.coverImage)} alt={mealPlan.recipe.title} className="bp-meal_plan_view__image" /> : <div className="bp-meal_plan_view__image_placeholder">No Image</div>}
        </div>
        <div className="bp-meal_plan_view__info_container">
          <Heading level={Heading.Level.H1} className="bp-meal_plan_view__title">
            About the Meal Plan
          </Heading>
          <p className="bp-meal_plan_view__description">{mealPlan.recipe?.description || "No description provided."}</p>
          <div className="bp-meal_plan_view__details">
            <Pill status={mealPlan.isCooked ? "success" : "warning"}>{mealPlan.isCooked ? "Cooked" : "Not Cooked"}</Pill>
            <Pill status={mealPlan.isSufficient ? "success" : "warning"}>{mealPlan.isSufficient ? "Sufficient Ingredients" : "Insufficient Ingredients"}</Pill>
            <p>
              <strong>Meal Type:</strong> {mealPlan.mealType}
            </p>
            <p>
              <strong>Plan Date:</strong> {mealPlan.planDate}
            </p>
          </div>
        </div>
      </div>
      <div className="bp-meal_plan_view__ingredients_container">
        <Heading level={Heading.Level.H2} className="bp-meal_plan_view__ingredients_heading">
          Ingredients
        </Heading>
        {mealPlan.confirmedIngredients?.length > 0 ? (
          <ul className="bp-meal_plan_view__ingredients_list">
            {mealPlan.confirmedIngredients.map((ingredient) => (
              <li key={ingredient.id} className="bp-meal_plan_view__ingredients_list_item">
                <span>{ingredient.ingredient?.title ?? "Unnamed Ingredient"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Alert variant="warning" title="No Ingredients Found" message="This meal plan does not have any confirmed ingredients." />
        )}
      </div>
    </CrudViewPageLayout>
  );
}
