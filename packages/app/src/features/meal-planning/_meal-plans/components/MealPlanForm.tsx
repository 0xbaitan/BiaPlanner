import { FormProvider, useForm } from "react-hook-form";
import { IConcreteRecipe, ICreateConcreteRecipeDto, IUpdateConcreteRecipeDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import ConcreteIngredientListInput from "./ConcreteIngredientListInput";
import Form from "react-bootstrap/Form";
import MealTypeSelect from "./MealTypeSelect";

export type ConcreteRecipeFormValues = ICreateConcreteRecipeDto | IUpdateConcreteRecipeDto;

export type MealPlanFormValues = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IConcreteRecipe>;
  onSubmit: (values: ConcreteRecipeFormValues) => void;
};

export default function MealPlanForm(props: MealPlanFormValues) {
  const { initialValue, onSubmit } = props;
  const methods = useForm<ConcreteRecipeFormValues>({
    defaultValues: initialValue ?? {},
    mode: "onBlur",
  });

  const { handleSubmit, getValues, setValue, reset } = methods;
  return (
    <div>
      <h2>Meal Plan Page Form</h2>
      <FormProvider {...methods}>
        <Form
          onSubmit={handleSubmit(() => {
            const values = getValues();
            reset();
            onSubmit(values);
          })}
        >
          <MealTypeSelect
            onChange={(mealType) => {
              setValue("mealType", mealType);
            }}
          />
          <ConcreteIngredientListInput />
          <Button type="submit">Submit</Button>
        </Form>
      </FormProvider>
    </div>
  );
}
