import { FormProvider, useForm } from "react-hook-form";
import { ICreateConcreteRecipeDto, IUpdateConcreteRecipeDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import ConcreteIngredientListInput from "./ConcreteIngredientListInput";
import Form from "react-bootstrap/Form";
import MealTypeSelect from "./MealTypeSelect";

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
        <Form
          onSubmit={methods.handleSubmit(() => {
            console.log(methods.getValues());
          })}
        >
          <MealTypeSelect
            onChange={(mealType) => {
              methods.setValue("mealType", mealType);
            }}
          />
          <ConcreteIngredientListInput />
          <Button type="submit">Submit</Button>
        </Form>
      </FormProvider>
    </div>
  );
}
