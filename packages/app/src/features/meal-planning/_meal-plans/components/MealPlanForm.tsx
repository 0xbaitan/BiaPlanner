import "../styles/MealPlanForm.scss";

import { FormProvider, useForm } from "react-hook-form";
import { IConcreteRecipe, ICreateConcreteRecipeDto, IUpdateConcreteRecipeDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import ConcreteIngredientListInput from "./ConcreteIngredientListInput";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Heading from "@/components/Heading";
import { MdCancel } from "react-icons/md";
import MealTypeSelect from "./MealTypeSelect";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const disableSubmit = props.disableSubmit ?? false;

  const { handleSubmit, getValues, setValue, reset } = methods;
  return (
    <FormProvider {...methods}>
      <DualPaneForm
        className="bp-meal_plan_form"
        onSubmit={handleSubmit(() => {
          const values = getValues();
          reset();
          onSubmit(values);
        })}
      >
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>Create Meal Plan</DualPaneForm.Header.Title>
          <DualPaneForm.Header.Actions>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
              <MdCancel />
              <span className="ms-2">Cancel</span>
            </Button>
            <Button type="submit" disabled={disableSubmit}>
              <FaSave />
              <span className="ms-2">Save meal plan</span>
            </Button>
          </DualPaneForm.Header.Actions>
        </DualPaneForm.Header>
        <DualPaneForm.Panel>
          <DualPaneForm.Panel.Pane>
            <MealTypeSelect
              onChange={(mealType) => {
                setValue("mealType", mealType);
              }}
            />
            <ConcreteIngredientListInput />
          </DualPaneForm.Panel.Pane>

          <DualPaneForm.Panel.Pane>
            <Heading level={Heading.Level.H2}>Manage your ingredients</Heading>
            <Heading level={Heading.Level.H3} className="+fg-main">
              Match ingredients to your available inventory
            </Heading>
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}
