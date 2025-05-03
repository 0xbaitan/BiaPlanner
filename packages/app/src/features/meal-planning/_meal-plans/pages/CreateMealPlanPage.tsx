import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import { IConcreteRecipe } from "@biaplanner/shared";
import MealPlanForm from "../components/MealPlanForm";
import { Status } from "@/hooks/useStatusToast";
import dayjs from "dayjs";
import { useCreateConcreteRecipeMutation } from "@/apis/ConcreteRecipeApi";

export default function CreateMealPlanPage() {
  const [createConcreteRecipe, { isLoading, isError, isSuccess }] = useCreateConcreteRecipeMutation();
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

  return (
    <div>
      <MealPlanForm
        type="create"
        onSubmit={async (values) => {
          setItem(values as IConcreteRecipe);
          await createConcreteRecipe(values);
        }}
      />
    </div>
  );
}
