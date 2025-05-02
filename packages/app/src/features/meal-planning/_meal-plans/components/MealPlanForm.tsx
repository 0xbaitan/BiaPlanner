import "../styles/MealPlanForm.scss";

import { FormProvider, useForm } from "react-hook-form";
import { IConcreteRecipe, IWriteConcreteRecipeDto } from "@biaplanner/shared";
import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import IngredientList from "./IngredientList";
import { MdCancel } from "react-icons/md";
import MealTypeSelect from "./MealTypeSelect";
import RecipeSelectOffcanvas from "./RecipeSelectOffcanvas";
import { getImagePath } from "@/util/imageFunctions";
import { useConfirmedIngredients } from "../../reducers/IngredientManagementReducer";
import { useNavigate } from "react-router-dom";

export type MealPlanFormValues = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IConcreteRecipe>;
  onSubmit: (values: IWriteConcreteRecipeDto) => void;
};

export default function MealPlanForm(props: MealPlanFormValues) {
  const { initialValue, onSubmit } = props;

  const methods = useForm<IWriteConcreteRecipeDto>({
    defaultValues: initialValue ?? {},
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const disableSubmit = props.disableSubmit ?? false;
  const confirmedIngredients = useConfirmedIngredients();
  const { handleSubmit, getValues, setValue, reset } = methods;
  const { showRecipeSelectionOffcanvas } = useMealPlanFormActions();
  const { selectedRecipe } = useMealPlanFormState();
  return (
    <FormProvider {...methods}>
      <DualPaneForm
        className="bp-meal_plan_form"
        onSubmit={handleSubmit(() => {
          let values = getValues();

          values = {
            ...values,
            confirmedIngredients,
          };
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
            <RecipeSelectOffcanvas />
            <Button onClick={showRecipeSelectionOffcanvas} variant="outline-primary" className="mb-3">
              Select Recipe
            </Button>
            <div className="recipe-info">
              <div className="recipe-info__image">
                <img className="recipe-info__image__img" src={getImagePath(selectedRecipe?.coverImage) ?? ""} alt={selectedRecipe?.title ?? "No recipe selected"} />
              </div>
              <div className="recipe-info__title">
                {selectedRecipe?.title ?? "No recipe selected"}
                {selectedRecipe && <span className="badge bg-primary">Selected</span>}
              </div>
              <div className="recipe-info__description">{selectedRecipe?.description}</div>
              <div className="recipe-info__categories">
                {selectedRecipe?.tags?.map((category) => (
                  <span key={category.id} className="badge bg-secondary me-1">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
            <Form.Group>
              <Form.Label>Meal type</Form.Label>
              <MealTypeSelect
                onChange={(mealType) => {
                  setValue("mealType", mealType);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of cooking</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => {
                  setValue("planDate", e.target.value);
                }}
              />
            </Form.Group>
          </DualPaneForm.Panel.Pane>

          <DualPaneForm.Panel.Pane>
            <Heading level={Heading.Level.H2}>Manage your ingredients</Heading>
            <Heading level={Heading.Level.H3} className="+fg-main">
              Match ingredients to your available inventory
            </Heading>
            <IngredientList />
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}
