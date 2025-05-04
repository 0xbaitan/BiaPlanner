import { useCreateConcreteRecipeMutation, useGetConcreteRecipeQuery } from "@/apis/ConcreteRecipeApi";
import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";
import { useNavigate, useParams } from "react-router-dom";

import { IWriteConcreteRecipeDto } from "@biaplanner/shared";
import MealPlanForm from "../components/MealPlanForm";
import { RoutePaths } from "@/Routes";
import { useEffect } from "react";
import { useGetRecipeQuery } from "@/apis/RecipeApi";
import { useSelectRecipe } from "../../reducers/IngredientManagementReducer";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditMealPlanPage() {
  const { id: recipeId } = useParams();
  const navigate = useNavigate();
  const {
    data: mealPlan,
    isError: recipeIsError,
    isLoading: recipeIsLoading,
    isSuccess: recipeIsSuccess,
  } = useGetConcreteRecipeQuery(String(recipeId), {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    skip: !recipeId,
  });
  const { resetMealPlanForm, selectRecipe } = useMealPlanFormActions();
  const [createConcreteRecipe, { isLoading, isError, isSuccess }] = useCreateConcreteRecipeMutation();

  const { notify: notifyOnCreate } = useSimpleStatusToast({
    idPrefix: "meal-plan-create",
    successMessage: "Meal plan updated successfully.",
    errorMessage: "Failed to update meal plan.",
    loadingMessage: "Updating meal plan...",
    isSuccess,
    isError,
    isLoading,
    onSuccess: () => {
      console.log("Meal edited successfully");
      navigate(RoutePaths.MEAL_PLANS); // Redirect to meal plans list
    },
    onFailure: () => {
      console.error("Failed to create meal plan");
    },
  });

  useEffect(() => {
    if (recipeIsSuccess && mealPlan.recipe) {
      selectRecipe(mealPlan.recipe);
    }
    return () => {};
  }, [recipeIsSuccess, mealPlan, selectRecipe]);

  const handleSubmit = async (values: IWriteConcreteRecipeDto) => {
    notifyOnCreate(); // Trigger toast notifications
    try {
      await createConcreteRecipe(values).unwrap();
    } catch (error) {
      console.error("Error creating meal plan:", error);
    }
  };

  if (recipeIsLoading) {
    return <div>Loading...</div>;
  }

  if (recipeIsError) {
    return <div>Error loading meal plan</div>;
  }

  if (!mealPlan) {
    return <div>Could not find the meal plan</div>;
  }

  return (
    <div>
      <MealPlanForm
        initialValue={
          mealPlan?.recipeId
            ? {
                ...mealPlan,
                recipeId: mealPlan.recipeId,
                planDate: mealPlan.planDate,
              }
            : undefined
        }
        type="update"
        onSubmit={handleSubmit}
        disableSubmit={isLoading}
      />
    </div>
  );
}
