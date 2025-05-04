import "../styles/MealPlanForm.scss";

import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { IConcreteRecipe, IWriteConcreteIngredientDto, IWriteConcreteRecipeDto, MealTypes, WriteConcreteRecipeDtoSchema } from "@biaplanner/shared";
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
import { useConfirmedIngredients } from "../../reducers/IngredientManagementReducer";
import { useNavigate } from "react-router-dom";
import useValidationErrorToast from "@/components/toasts/ValidationErrorToast";
import { zodResolver } from "@hookform/resolvers/zod";

export type MealPlanFormValues = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: IConcreteRecipe;
  onSubmit: (values: IWriteConcreteRecipeDto) => void;
};

export default function MealPlanForm(props: MealPlanFormValues) {
  const { initialValue, onSubmit } = props;
  const { selectedRecipe } = useMealPlanFormState();
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
    resolver: zodResolver(WriteConcreteRecipeDtoSchema),
  });
  const navigate = useNavigate();
  const disableSubmit = props.disableSubmit ?? false;
  const confirmedIngredients = useConfirmedIngredients();
  const { handleSubmit, setValue } = methods;
  const { showRecipeSelectionOffcanvas } = useMealPlanFormActions();

  const { onSubmitError } = useValidationErrorToast();

  const onSubmitSuccess = useCallback(
    (values: IWriteConcreteRecipeDto) => {
      if (!selectedRecipe) {
        return;
      }

      const mealPlan: IWriteConcreteRecipeDto = {
        ...values,
        confirmedIngredients,
        recipeId: selectedRecipe?.id,
      };

      console.log("Meal Plan submitted:", mealPlan);

      onSubmit(mealPlan);
    },
    [confirmedIngredients, onSubmit, selectedRecipe]
  );

  useEffect(() => {
    console.log(methods.watch());
  }, [methods, methods.watch]);

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

  return (
    <Form.Group>
      <Form.Label>Meal type</Form.Label>
      <Controller
        name="mealType"
        control={control}
        render={({ field }) => (
          <Form.Select
            className="form-select"
            {...field}
            onChange={(e) => {
              field.onChange(e);
            }}
            value={field.value}
          >
            <option value={MealTypes.BREAKFAST}>Breakfast</option>
            <option value={MealTypes.LUNCH}>Lunch</option>
            <option value={MealTypes.DINNER}>Dinner</option>
          </Form.Select>
        )}
      />
      <ErrorMessage name="mealType" />
    </Form.Group>
  );
}

function PlanDateField() {
  const { control } = useFormContext<IWriteConcreteRecipeDto>();

  return (
    <Form.Group>
      <Form.Label>Date of cooking</Form.Label>
      <Controller
        name="planDate"
        control={control}
        render={({ field }) => (
          <input
            type="date"
            className="form-control"
            {...field}
            onChange={(e) => {
              field.onChange(e);
            }}
            value={dayjs(field.value).format("YYYY-MM-DD")}
          />
        )}
      />
      <ErrorMessage name="mealType" />
    </Form.Group>
  );
}
