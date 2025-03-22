import "../styles/RecipeForm.scss";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ICreateRecipeDto, IRecipe, IRecipeIngredient, IUpdateRecipeDto, Weights } from "@biaplanner/shared";
import { useConfirmedIngredientsState, useOpenCreateIngredientModal } from "../../reducers/RecipeFormReducer";
import { useEffect, useMemo } from "react";

import Button from "react-bootstrap/Button";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaPlus } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import { ImageSelector } from "@/components/forms/ImageSelector";
import IngredientItem from "./IngredientItem";
import IngredientModal from "./IngredientModal";
import InputLabel from "@/components/forms/InputLabel";
import { MdCancel } from "react-icons/md";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import SegmentedTimeInput from "@/components/forms/SegmentedTimeInput";
import TextInput from "@/components/forms/TextInput";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type RecipeFormValues = IUpdateRecipeDto | ICreateRecipeDto;

const ingredientsSchema = z.object({
  productCategories: z.array(z.string()),
  title: z.string().min(1, { message: "Ingredient title is required" }),
  measurement: z.object({
    unit: z.string().min(1, { message: "Ingredient measurement unit is required" }),
    magnitude: z.number().min(0, { message: "Ingredient measurement magnitude must be greater than 0" }),
  }),
});

export const CreateRecipeValidationSchema = z.object({
  ingredients: z.array(ingredientsSchema),
  newTags: z.array(z.object({ name: z.string() })).nullable(),
  tags: z
    .array(
      z.object({
        id: z.string({
          required_error: "Recipe tag id is required",
          invalid_type_error: "Recipe tag id must be a string",
        }),
      }),
      {
        required_error: "Recipe must have at least one tag",
      }
    )
    .length(1, { message: "Recipe must have at least one tag" }),

  title: z
    .string({
      required_error: "Recipe title is required",
      invalid_type_error: "Recipe title must be composed of characters",
    })
    .min(1),
  description: z.string().nullable(),
  instructions: z
    .string({
      required_error: "Recipe instructions are required",
      invalid_type_error: "Recipe instructions must be composed of characters",
    })
    .min(1),
  difficultyLevel: z.string().nullable(),
  cuisineId: z.string().min(1, { message: "Recipe cuisine is required" }),
  prepTime: z.object({
    hours: z.number().min(0).max(23),
    minutes: z.number().min(0).max(59),
    days: z.number().min(0).max(7),
    seconds: z.number().min(0).max(59),
  }),
  cookingTime: z.object({
    hours: z.number().min(0).max(23),
    minutes: z.number().min(0).max(59),
    days: z.number().min(0).max(7),
    seconds: z.number().min(0).max(59),
  }),
});

export const UpdateRecipeTagValidationSchema = z.object({
  id: z.string().min(1, { message: "Recipe tag id is required" }),
});

export type RecipeFormProps = {
  initialValue?: IRecipe;
  type: "create" | "update";
  onSubmit: (values: RecipeFormValues) => void;
  disableSubmit?: boolean;
};
export default function RecipeForm(props: RecipeFormProps) {
  const { initialValue, onSubmit, type, disableSubmit } = props;
  const { resetConfirmedIngredients } = useConfirmedIngredientsState();

  useEffect(() => {
    resetConfirmedIngredients();
  }, [resetConfirmedIngredients]);

  const navigate = useNavigate();
  const formMethods = useForm<RecipeFormValues>({
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      ...initialValue,
      ingredients: initialValue?.ingredients ?? [
        {
          productCategories: [],
          measurement: {
            unit: Weights.GRAM,
            magnitude: 0,
          },
        },
      ],
    },
    resolver: zodResolver(type === "create" ? CreateRecipeValidationSchema : UpdateRecipeTagValidationSchema),
  });

  const { handleSubmit, setValue, getValues, formState } = formMethods;

  console.log(formState.errors);
  return (
    <FormProvider {...formMethods}>
      <IngredientModal />
      <DualPaneForm
        onSubmit={handleSubmit(() => {
          const dto = getValues();
          console.log(dto);
          onSubmit(dto);
        })}
        className="bp-recipe_form"
      >
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>{type === "create" ? "Create Recipe" : "Update Recipe"}</DualPaneForm.Header.Title>
          <DualPaneForm.Header.Actions>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
              <MdCancel />
              <span className="ms-2">Cancel</span>
            </Button>
            <Button type="submit" disabled={disableSubmit}>
              <FaSave />
              <span className="ms-2">Save recipe</span>
            </Button>
          </DualPaneForm.Header.Actions>
        </DualPaneForm.Header>
        <DualPaneForm.Panel>
          <DualPaneForm.Panel.Pane md={4}>
            <Heading level={Heading.Level.H2}>General Information</Heading>
            <ImageSelector helpText="Upload a cover image for this recipe. Recommended image dimensions are 1200 x 800 px." />
            <div className="bp-recipe_form__general_info">
              <TextInput
                label="Recipe title"
                defaultValue={initialValue?.title}
                inputLabelProps={{ required: true }}
                error={formState.errors.title?.message}
                onChange={(e) => {
                  const { value } = e.target;
                  setValue("title", value);
                }}
              />
              <DifficultyLevelSelect
                onChange={(value) => {
                  setValue("difficultyLevel", value);
                }}
                initialValue={initialValue?.difficultyLevel}
                inputLabelProps={{ required: true }}
                error={formState.errors.difficultyLevel?.message === "Required" ? "Difficulty level is required" : formState.errors.difficultyLevel?.message}
              />
              <CuisineSelect
                onChange={(value) => {
                  setValue("cuisineId", value.id);
                }}
                initialValueId={String(initialValue?.cuisine?.id)}
                inputLabelProps={{ required: true }}
                error={formState.errors.cuisineId?.message === "Required" ? "Cuisine is required" : formState.errors.cuisineId?.message}
              />
              <Form.Group>
                <InputLabel required>Preparation time</InputLabel>
                <SegmentedTimeInput
                  onChange={(segmentedTime) => {
                    setValue("prepTime", segmentedTime);
                  }}
                  initialValue={initialValue?.prepTime}
                />
              </Form.Group>
              <Form.Group>
                <InputLabel required>Cooking time</InputLabel>
                <SegmentedTimeInput
                  onChange={(segmentedTime) => {
                    setValue("cookingTime", segmentedTime);
                  }}
                  initialValue={initialValue?.cookingTime}
                />
              </Form.Group>
              <RecipeTagsMultiselect
                inputLabelProps={{ required: true }}
                initialValues={initialValue?.tags}
                onChange={(tags) => {
                  setValue(
                    "tags",
                    tags.map((tag) => ({
                      id: tag.id,
                    }))
                  );
                }}
                error={formState.errors.tags?.message}
              />
              <TextInput
                label="Recipe Description"
                defaultValue={initialValue?.description}
                onChange={(e) => {
                  const { value } = e.target;
                  setValue("description", value);
                }}
                as="textarea"
              />
            </div>
          </DualPaneForm.Panel.Pane>
          <DualPaneForm.Panel.Pane>
            <Heading level={Heading.Level.H2}>Ingredients</Heading>

            <IngredientList />
            <TextInput
              formGroupClassName="mt-5"
              label="Instructions"
              defaultValue={initialValue?.instructions}
              onChange={(e) => {
                const { value } = e.target;
                setValue("instructions", value);
              }}
              as="textarea"
            />
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}

function IngredientList() {
  const { confirmedIngredients } = useConfirmedIngredientsState();
  const { setValue, getValues } = useFormContext<RecipeFormValues>();
  const openCreateIngredientModal = useOpenCreateIngredientModal();
  useEffect(() => {
    setValue("ingredients", confirmedIngredients);
  }, [confirmedIngredients, setValue]);

  const ingredientItems = useMemo(() => {
    return (
      <div className="bp-ingredient_list">
        <div className="bp-ingredient_list__header">
          <div className="bp-ingredient_list__header__title">
            <h3 className="bp-h3">Ingredient List</h3>
          </div>
          <div className="bp-ingredient_list__header__actions">
            <Button
              type="button"
              onClick={() => {
                openCreateIngredientModal({
                  index: 0,
                  onConfirmIngredient: (ingredient) => {
                    setValue("ingredients", (getValues("ingredients") ?? []).concat(ingredient));
                  },
                });
              }}
            >
              <FaPlus /> <span className="ps-2">Add ingredient</span>
            </Button>
          </div>
        </div>
        <div className="bp-ingredient_list__content">
          {confirmedIngredients && confirmedIngredients.length > 0 ? (
            <div className="bp-ingredient_list__content__list">
              {confirmedIngredients.map((ingredient, index) => (
                <IngredientItem key={index} ingredient={ingredient as IRecipeIngredient} index={index} />
              ))}
            </div>
          ) : (
            <div className="bp-ingredient_list__content__no_list_message">No ingredients have been added yet, add at least one ingredient.</div>
          )}
        </div>
      </div>
    );
  }, [confirmedIngredients, getValues, openCreateIngredientModal, setValue]);

  return ingredientItems;
}
