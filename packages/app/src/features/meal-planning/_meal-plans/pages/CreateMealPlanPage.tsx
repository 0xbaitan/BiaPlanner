import { useEffect, useState } from "react";

import MealPlanForm from "../components/MealPlanForm";
import { RoutePaths } from "@/Routes";
import { useCreateConcreteRecipeMutation } from "@/apis/ConcreteRecipeApi";
import { useMealPlanFormActions } from "../../reducers/MealPlanFormReducer";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateMealPlanPage() {
  const [createConcreteRecipe, { isLoading, isError, isSuccess }] = useCreateConcreteRecipeMutation();
  const navigate = useNavigate();
  const [isInitialised, setInitialised] = useState<boolean>(false);
  const { resetForm: resetMealPlanForm } = useMealPlanFormActions();

  const { notify } = useSimpleStatusToast({
    idPrefix: "create-meal-plan",
    isError,
    isLoading,
    isSuccess,
    successMessage: "Meal plan created successfully",
    errorMessage: "Failed to create meal plan",
    loadingMessage: "Creating meal plan...",
    onSuccess: () => {
      // Reset the form and redirect to another page
      resetMealPlanForm();
      navigate(RoutePaths.MEAL_PLANS);
    },
  });

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!isInitialised) {
        resetMealPlanForm();
        setInitialised(true);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [isInitialised, resetMealPlanForm]);

  return (
    <div>
      <MealPlanForm
        type="create"
        onSubmit={async (values) => {
          notify();
          await createConcreteRecipe(values);
        }}
      />
    </div>
  );
}
