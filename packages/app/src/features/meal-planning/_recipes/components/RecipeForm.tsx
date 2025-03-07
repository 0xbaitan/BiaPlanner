import "../styles/RecipeForm.scss";

import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { ICreateRecipeDto, IRecipe, IRecipeIngredient, IUpdateRecipeDto, Weights } from "@biaplanner/shared";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import CuisineSelect from "./CuisineSelect";
import { DeepPartial } from "react-hook-form";
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
import { useSetShowIngredientModal } from "../../reducers/RecipeFormReducer";
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
  prepTimeMagnitude: z.number().min(1, { message: "Recipe prep time magnitude is required" }),
  prepTimeUnit: z.string().min(1, { message: "Recipe prep time unit is required" }),
  cookTimeMagnitude: z.number().min(1, { message: "Recipe cook time magnitude is required" }),
  cookTimeUnit: z.string().min(1, { message: "Recipe cook time unit is required" }),
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
  const setShowIngredientModal = useSetShowIngredientModal();
  const { handleSubmit, setValue, getValues } = formMethods;
  console.log("initialValue", initialValue?.tags);

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
              <CookingTimeInput cookTimeMagnitude={initialValue?.cookTimeMagnitude} cookTimeUnit={initialValue?.cookTimeUnit} />
              <PreparationTimeInput prepTimeMagnitude={initialValue?.prepTimeMagnitude} prepTimeUnit={initialValue?.prepTimeUnit} />

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
                  setShowIngredientModal(true);
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
  const { getValues } = useFormContext<RecipeFormValues>();
  const ingredients = getValues("ingredients");

  return (
    <div>
      {ingredients && ingredients.length > 0 ? (
        <div className="bp-ingredient_list">
          {ingredients.map((ingredient, index) => (
            <IngredientItem key={index} ingredient={ingredient as IRecipeIngredient} index={index} />
          ))}
        </div>
      ) : (
        <div>No list</div>
      )}
    </div>
  );
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
              onRemove={() => remove(index)}
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

function CookingTimeInput(props: Partial<Pick<IRecipe, "cookTimeMagnitude" | "cookTimeUnit">>) {
  const { cookTimeMagnitude, cookTimeUnit } = props;
  const { setValue } = useFormContext<RecipeFormValues>();
  return (
    <Form.Group>
      <Form.Label>Cooking Time</Form.Label>
      <TimeInput
        defaultMagnitude={cookTimeMagnitude}
        defaultUnit={cookTimeUnit}
        onChange={(magnitude, unit) => {
          setValue("cookTimeMagnitude", magnitude);
          setValue("cookTimeUnit", unit);
        }}
      />
      <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
    </Form.Group>
  );
}

function PreparationTimeInput(props: Partial<Pick<IRecipe, "prepTimeMagnitude" | "prepTimeUnit">>) {
  const { prepTimeMagnitude, prepTimeUnit } = props;
  const { setValue } = useFormContext<RecipeFormValues>();
  return (
    <Form.Group>
      <Form.Label>Preparation Time</Form.Label>
      <TimeInput
        defaultMagnitude={prepTimeMagnitude}
        defaultUnit={prepTimeUnit}
        onChange={(magnitude, unit) => {
          setValue("prepTimeMagnitude", magnitude);
          setValue("prepTimeUnit", unit);
        }}
      />
      <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
    </Form.Group>
  );
}
