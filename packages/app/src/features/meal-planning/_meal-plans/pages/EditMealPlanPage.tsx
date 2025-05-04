import { useEffect, useState } from "react";
import { useGetConcreteRecipeQuery, useUpdateConcreteRecipeMutation } from "@/apis/ConcreteRecipeApi";
import { useNavigate, useParams } from "react-router-dom";

import { IWriteConcreteRecipeDto } from "@biaplanner/shared";
import MealPlanForm from "../components/MealPlanForm";
import { RoutePaths } from "@/Routes";
import { useMealPlanFormActions } from "../../reducers/MealPlanFormReducer";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditMealPlanPage() {
  const { id: mealPlanId } = useParams();
  const navigate = useNavigate();
  const {
    data: mealPlan,
    isError: recipeIsError,
    isLoading: recipeIsLoading,
    isSuccess: recipeIsSuccess,
  } = useGetConcreteRecipeQuery(String(mealPlanId), {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    skip: !mealPlanId,
  });
  const { resetForm, initialiseForm } = useMealPlanFormActions();

  const [updateConcreteRecipe, { isLoading, isError, isSuccess }] = useUpdateConcreteRecipeMutation();
  const [isInitialised, setInitialised] = useState<boolean>(false);
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
    const debounceTimeout = setTimeout(() => {
      if (recipeIsSuccess && mealPlan && !isInitialised && mealPlan.recipe) {
        resetForm();
        initialiseForm(mealPlan);
        setInitialised(true);
        console.log("Initialised ingredients and selected recipe:", mealPlan.recipe);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [initialiseForm, isInitialised, mealPlan, recipeIsSuccess, resetForm]);

  const handleSubmit = async (values: IWriteConcreteRecipeDto) => {
    notifyOnCreate(); // Trigger toast notifications
    try {
      await updateConcreteRecipe({
        id: String(mealPlanId),
        dto: values,
      });
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
