import "../styles/MealPlanForm.scss";

import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { IConcreteRecipe, IWriteConcreteRecipeDto, MealTypes, WriteConcreteRecipeDtoSchema } from "@biaplanner/shared";
import { useCallback, useEffect } from "react";
import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { ErrorMessage } from "@hookform/error-message";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import IngredientList from "./IngredientList";
import { MdCancel } from "react-icons/md";
import RecipeSelectOffcanvas from "./RecipeSelectOffcanvas";
import dayjs from "dayjs";
import { getImagePath } from "@/util/imageFunctions";
import { useNavigate } from "react-router-dom";
import useValidationErrorToast from "@/components/toasts/ValidationErrorToast";

export type MealPlanFormValues = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: IConcreteRecipe;
  onSubmit: (values: IWriteConcreteRecipeDto) => void;
};

export default function MealPlanForm(props: MealPlanFormValues) {
  const { initialValue, onSubmit } = props;
  const { selectedRecipe, formValue, disableRecipeSelection } = useMealPlanFormState();
  const methods = useForm<IWriteConcreteRecipeDto>({
    defaultValues: initialValue
      ? {
          recipeId: initialValue.recipeId ?? selectedRecipe?.id,
          mealType: initialValue.mealType ?? MealTypes.BREAKFAST,
          planDate: initialValue.planDate ?? dayjs().toISOString(),
          confirmedIngredients: initialValue.confirmedIngredients.map((ingredient) => ({
            ...ingredient,
          })),

          numberOfServings: initialValue.numberOfServings,
        }
      : {
          mealType: MealTypes.BREAKFAST,
          planDate: dayjs().toISOString(),
          recipeId: selectedRecipe?.id,
        },
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const disableSubmit = props.disableSubmit ?? false;

  const { handleSubmit, setValue } = methods;
  const { showRecipeSelectionOffcanvas } = useMealPlanFormActions();

  const { onSubmitError } = useValidationErrorToast();

  const onSubmitSuccess = useCallback(
    (values: IWriteConcreteRecipeDto) => {
      if (!selectedRecipe) {
        return;
      }

      const dto: IWriteConcreteRecipeDto = {
        ...values,
        ...formValue,
      };

      const parsedDtoResult = WriteConcreteRecipeDtoSchema.safeParse(dto);
      if (!parsedDtoResult.success) {
        parsedDtoResult.error.issues.forEach((issue) => {
          console.error("Validation error:", issue);
          methods.setError(issue.path[0] as keyof IWriteConcreteRecipeDto, {
            type: "manual",
            message: issue.message,
          });
        });

        return;
      }

      const parsedDto: IWriteConcreteRecipeDto = parsedDtoResult.data;
      console.log("Submitting meal plan form with values:", parsedDto);
      onSubmit(parsedDto);
    },

    [formValue, methods, onSubmit, selectedRecipe]
  );

  useEffect(() => {
    console.log("Form value changed:", formValue);
  }, [formValue]);
  return (
    <FormProvider {...methods}>
      <DualPaneForm className="bp-meal_plan_form" onSubmit={handleSubmit(onSubmitSuccess, onSubmitError)}>
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>{props.type === "create" ? "Create Meal Plan" : "Edit Meal Plan"}</DualPaneForm.Header.Title>
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
            <RecipeSelectOffcanvas
              onSelect={(recipe) => {
                setValue("recipeId", recipe.id);
              }}
            />
            <Button
              disabled={disableRecipeSelection}
              onClick={() => {
                showRecipeSelectionOffcanvas();
                console.log("Recipe selection offcanvas opened");
              }}
              variant="outline-primary"
              className="mb-3"
            >
              Select Recipe
            </Button>
            <RecipeInformation />
            <MealTypeSelectInput />
            <PlanDateField />
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

function RecipeInformation() {
  const { selectedRecipe } = useMealPlanFormState();
  return (
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
  );
}

function MealTypeSelectInput() {
  const { control } = useFormContext<IWriteConcreteRecipeDto>();
  const { setFormValue } = useMealPlanFormActions();
  const { formValue } = useMealPlanFormState();
  console.log("Meal type select input value:", formValue.mealType);
  return (
    <Form.Group>
      <Form.Label>Meal type</Form.Label>

      <Form.Select
        name="mealType"
        value={formValue.mealType}
        onChange={(e) => {
          setFormValue({
            mealType: e.target.value as MealTypes,
          });
        }}
        className="form-control"
      >
        <option value={MealTypes.BREAKFAST}>Breakfast</option>
        <option value={MealTypes.LUNCH}>Lunch</option>
        <option value={MealTypes.DINNER}>Dinner</option>
      </Form.Select>
      <ErrorMessage name="mealType" />
    </Form.Group>
  );
}

function PlanDateField() {
  const { formValue } = useMealPlanFormState();
  const { setFormValue } = useMealPlanFormActions();
  console.log("Plan date field value:");
  return (
    <Form.Group>
      <Form.Label>Plan date</Form.Label>
      <input
        type="date"
        name="planDate"
        value={dayjs(formValue.planDate).format("YYYY-MM-DD")}
        className="form-control"
        onChange={(e) => {
          setFormValue({
            planDate: e.target.value,
          });
        }}
      />

      <ErrorMessage name="mealType" />
    </Form.Group>
  );
}
