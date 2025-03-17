import "../styles/MealPlanForm.scss";

import { FormProvider, useForm } from "react-hook-form";
import { IConcreteRecipe, ICreateConcreteRecipeDto, IUpdateConcreteRecipeDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/Col";
import ConcreteIngredientListInput from "./ConcreteIngredientListInput";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import MealTypeSelect from "./MealTypeSelect";
import Row from "react-bootstrap/Row";

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
          className="bp-meal_plan_form"
          onSubmit={handleSubmit(() => {
            const values = getValues();
            reset();
            onSubmit(values);
          })}
        >
          <Container fluid>
            <Row className="bp-meal_plan_form__dual_panel">
              <Col md={4} className="bp-meal_plan_form__dual_panel__pane">
                <MealTypeSelect
                  onChange={(mealType) => {
                    setValue("mealType", mealType);
                  }}
                />
                <ConcreteIngredientListInput />
              </Col>
              <Col className="bp-meal_plan_form__dual_panel__pane">
                {" "}
                <Button type="submit">Submit</Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </FormProvider>
    </div>
  );
}
