import { FormProvider, useForm } from "react-hook-form";
import { ICreateConcreteRecipeDto, IUpdateConcreteRecipeDto } from "@biaplanner/shared";

import ConcreteIngredientListInput from "./ConcreteIngredientListInput";
import Form from "react-bootstrap/Form";

export type ConcreteRecipeFormValues = ICreateConcreteRecipeDto | IUpdateConcreteRecipeDto;

export default function MealPlanForm() {
  const methods = useForm<ConcreteRecipeFormValues>({
    defaultValues: {},
    mode: "onBlur",
  });
  return (
    <div>
      <h2>Meal Plan Page Form</h2>
      <FormProvider {...methods}>
        <Form>
          <ConcreteIngredientListInput />
        </Form>
      </FormProvider>
    </div>
  );
}
