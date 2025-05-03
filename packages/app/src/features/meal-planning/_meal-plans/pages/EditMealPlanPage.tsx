import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import { IWriteConcreteRecipeDto } from "@biaplanner/shared";
import MealPlanForm from "../components/MealPlanForm";
import { RoutePaths } from "@/Routes";
import { useCreateConcreteRecipeMutation } from "@/apis/ConcreteRecipeApi";
import { useEffect } from "react";
import { useGetRecipeQuery } from "@/apis/RecipeApi";
import { useNavigate } from "react-router-dom";
import { useSelectRecipe } from "../../reducers/IngredientManagementReducer";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateMealPlanPage() {
  const { selectedRecipe } = useMealPlanFormState();
  const navigate = useNavigate();
  const { data: recipe, isError: recipeIsError, isLoading: recipeIsLoading, isSuccess: recipeIsSuccess } = useGetRecipeQuery(String(selectedRecipe?.id));
  const { resetMealPlanForm, selectRecipe } = useMealPlanFormActions();
  const [createConcreteRecipe, { isLoading, isError, isSuccess }] = useCreateConcreteRecipeMutation();

  const { notify: notifyOnCreate } = useSimpleStatusToast({
    idPrefix: "meal-plan-create",
    successMessage: "Meal plan created successfully.",
    errorMessage: "Failed to create meal plan.",
    loadingMessage: "Creating meal plan...",
    isSuccess,
    isError,
    isLoading,
    onSuccess: () => {
      console.log("Meal plan created successfully");
      navigate(RoutePaths.MEAL_PLANS); // Redirect to meal plans list
    },
    onFailure: () => {
      console.error("Failed to create meal plan");
    },
  });

  useEffect(() => {
    if (recipeIsSuccess && recipe) {
      selectRecipe(recipe);
    }
  }, [recipe, recipeIsSuccess, selectRecipe]);

  useEffect(() => {
    return () => {
      console.log("Cleaning up meal plan form");
      resetMealPlanForm();
    };
  }, [resetMealPlanForm]);

  const handleSubmit = async (values: IWriteConcreteRecipeDto) => {
    notifyOnCreate(); // Trigger toast notifications
    try {
      await createConcreteRecipe(values).unwrap();
    } catch (error) {
      console.error("Error creating meal plan:", error);
    }
  };

  return (
    <div>
      <MealPlanForm
        initialValue={{
          recipe: recipe,
          recipeId: recipe?.id,
        }}
        type="create"
        onSubmit={handleSubmit}
        disableSubmit={isLoading}
      />
    </div>
  );
}
