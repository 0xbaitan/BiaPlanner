import { IConcreteRecipe, IWriteConcreteRecipeDto } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetMealPlanForm, useSelectRecipe } from "../../reducers/IngredientManagementReducer";

import MealPlanForm from "../components/MealPlanForm";
import { RoutePaths } from "@/Routes";
import { Status } from "@/hooks/useStatusToast";
import dayjs from "dayjs";
import { useCreateConcreteRecipeMutation } from "@/apis/ConcreteRecipeApi";
import { useEffect } from "react";
import { useGetRecipeQuery } from "@/apis/RecipeApi";
import { useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

export default function CreateMealPlanPage() {
  const [searchParams] = useSearchParams();
  const { selectedRecipe } = useMealPlanFormState();
  const navigate = useNavigate();
  const { data: recipe, isError: recipeIsError, isLoading: recipeIsLoading, isSuccess: recipeIsSuccess } = useGetRecipeQuery(String(selectedRecipe?.id));
  const resetMealPlanForm = useResetMealPlanForm();
  const [createConcreteRecipe, { isLoading, isError, isSuccess }] = useCreateConcreteRecipeMutation();
  const selectRecipe = useSelectRecipe();
  const { setItem } = useDefaultStatusToast<IConcreteRecipe>({
    idSelector: (entity) => entity.id,
    action: Action.CREATE,
    entityIdentifier: (entity) => `Meal scheduled for  ${entity.mealType} on ${dayjs(entity.planDate).format("DD/MM/YYYY")}`,
    isSuccess: isSuccess,
    isError: isError,
    idPrefix: "meal-plan",
    isLoading,
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Return to Meal Plans",
      redirectUrl: "/",
    },
  });

  useEffect(() => {
    if (recipeIsSuccess && recipe) {
      selectRecipe(recipe);
    }
  }, [recipe, recipeIsSuccess, selectRecipe]);

  useEffect(() => {
    if (isSuccess) {
      resetMealPlanForm();
    }
  }, [isSuccess, resetMealPlanForm]);

  useEffect(() => {
    return () => {
      resetMealPlanForm();
    };
  }, [resetMealPlanForm]);

  // if (recipeIsError) {
  //   return <div>There was an error</div>;
  // }

  // if (recipeIsLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!recipeIsSuccess || !recipe) {
  //   return <div>Recipe not found</div>;
  // }
  return (
    <div>
      <MealPlanForm
        initialValue={{
          recipe: recipe,
          recipeId: recipe?.id,
        }}
        type="create"
        onSubmit={async (values) => {
          setItem(values as IConcreteRecipe);
          await createConcreteRecipe(values);
        }}
      />
    </div>
  );
}
