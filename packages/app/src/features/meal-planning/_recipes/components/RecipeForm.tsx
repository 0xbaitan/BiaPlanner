import "../styles/RecipeForm.scss";

import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { ICreateRecipeDto, IRecipe, IRecipeIngredient, IUpdateRecipeDto, Weights } from "@biaplanner/shared";
import { useConfirmedIngredientsState, useOpenCreateIngredientModal } from "../../reducers/RecipeFormReducer";
import { useEffect, useMemo } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import { FaPlus } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import { ImageSelector } from "@/components/forms/ImageSelector";
import IngredientInput from "./IngredientInput";
import IngredientItem from "./IngredientItem";
import IngredientModal from "./IngredientModal";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import Row from "react-bootstrap/Row";
import SegmentedTimeInput from "@/components/forms/SegmentedTimeInput";
import TextInput from "@/components/forms/TextInput";
import TimeInput from "@/components/forms/TimeInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type RecipeFormValues = IUpdateRecipeDto | ICreateRecipeDto;

const ingredientsSchema = z.object({
  productCategories: z.array(z.string()),
  quantity: z.number(),
  weightUnit: z.string().nullable(),
  volumeUnit: z.string().nullable(),
  approximateUnit: z.string().nullable(),
});

export const CreateRecipeValidationSchema = z.object({
  ingredients: z.array(ingredientsSchema),
  newTags: z.array(z.object({ name: z.string() })),
  tags: z.array(z.object({ id: z.string() })),
  title: z.string().min(1, { message: "Recipe title is required" }),
  description: z.string().nullable(),
  instructions: z.string().min(1, { message: "Recipe instructions are required" }),
  difficultyLevel: z.string().min(1, { message: "Recipe difficulty level is required" }),
  cuisineId: z.string().min(1, { message: "Recipe cuisine is required" }),
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
  const openCreateIngredientModal = useOpenCreateIngredientModal();
  const { handleSubmit, setValue, getValues, formState } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <IngredientModal />
      <Form
        onSubmit={handleSubmit(() => {
          const dto = getValues();
          onSubmit(dto);
        })}
      >
        <Container fluid>
          <Row className="bp-recipe_form_dual_panel">
            <Col className="bp-recipe_form_dual_panel__pane" md={4}>
              <h2 className="bp-recipe_form_dual_panel__pane_heading">Recipe General Information</h2>
              <ImageSelector helpText="Upload a cover image for this recipe. Recommended image dimensions are 1200 x 800 px." />
              <TextInput
                label="Recipe Title"
                defaultValue={initialValue?.title}
                onChange={(e) => {
                  const { value } = e.target;
                  setValue("title", value);
                }}
              />
              <DifficultyLevelSelect
                onChange={(value) => {
                  setValue("difficultyLevel", value);
                }}
              />
              <CuisineSelect
                onChange={(value) => {
                  setValue("cuisineId", value.id);
                }}
              />
              <SegmentedTimeInput
                onChange={(segmentedTime) => {
                  console.log("segmentedTime", segmentedTime);
                }}
              />

              <RecipeTagsMultiselect
                initialValues={initialValue?.tags}
                onChange={(tags) => {
                  setValue(
                    "tags",
                    tags.map((tag) => ({
                      id: tag.id,
                    }))
                  );
                }}
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
            </Col>
            <Col className="bp-recipe_form_dual_panel__pane">
              <h2 className="bp-recipe_form_dual_panel__pane_heading">Recipe Details</h2>
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
                Add Ingredient
              </Button>
              {/* <IngredientListInput /> */}
              <IngredientList />
              <TextInput
                label="Instructions"
                defaultValue={initialValue?.instructions}
                onChange={(e) => {
                  const { value } = e.target;
                  setValue("instructions", value);
                }}
                as="textarea"
              />
              <Button type="submit" disabled={disableSubmit}>
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </FormProvider>
  );
}

function IngredientList() {
  const { confirmedIngredients } = useConfirmedIngredientsState();
  const ingredientItems = useMemo(() => {
    return (
      <div>
        {confirmedIngredients && confirmedIngredients.length > 0 ? (
          <div className="bp-ingredient_list">
            {confirmedIngredients.map((ingredient, index) => (
              <IngredientItem key={index} ingredient={ingredient as IRecipeIngredient} index={index} />
            ))}
          </div>
        ) : (
          <div>No list</div>
        )}
      </div>
    );
  }, [confirmedIngredients]);

  return ingredientItems;
}

function IngredientListInput() {
  const { control, setValue } = useFormContext<RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients", keyName: "ingredientFieldId" });

  return (
    <div className="bp-ingredient_list_input">
      <div className="bp-ingredient_list_input__fields">
        {fields.map((field, index) => {
          const { ingredientFieldId, ...ingredient } = field;
          return (
            <IngredientInput
              key={ingredientFieldId}
              initialValue={ingredient as IRecipeIngredient}
              onChange={(value) => {
                setValue(`ingredients.${index}`, value);
              }}
            />
          );
        })}
      </div>
      <Button
        type="button"
        className="bp-ingredient_list_input__add_ingredient_btn"
        onClick={() =>
          append({
            productCategories: [],
            measurement: {
              unit: Weights.GRAM,
              magnitude: 0,
            },
          })
        }
      >
        <FaPlus />
        <span className="ms-3">Add ingredient</span>
      </Button>
    </div>
  );
}
