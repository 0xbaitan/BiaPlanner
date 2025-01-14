import { CreateRecipeDto, IRecipe, IRecipeIngredient, UpdateRecipeDto } from "@biaplanner/shared";
import { DeepPartial, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";

import Button from "react-bootstrap/Button";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import Form from "react-bootstrap/Form";
import IngredientInput from "./IngredientInput";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import TextInput from "@/components/forms/TextInput";
import TimeInput from "@/components/forms/TimeInput";

export type RecipeFormValues = (UpdateRecipeDto | CreateRecipeDto) & { ingredients: DeepPartial<IRecipeIngredient>[] };

export type RecipeFormProps = {
  initialValue?: IRecipe;
  onSubmit: (values: RecipeFormValues) => void;
};
export default function RecipeForm(props: RecipeFormProps) {
  const { initialValue, onSubmit } = props;
  const formMethods = useForm<RecipeFormValues>({
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      ...initialValue,
      ingredients: initialValue?.ingredients ?? [
        {
          productCategories: [],
          quantity: 0,
          weightUnit: null,
          volumeUnit: null,
          approximateUnit: null,
        },
      ],
    },
  });

  const { handleSubmit, setValue, getValues } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form
        onSubmit={handleSubmit(() => {
          const dto = getValues();
          onSubmit(dto);
        })}
      >
        <h1>Recipe Form</h1>
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
        <CookingTimeInput cookTimeMagnitude={initialValue?.cookTimeMagnitude} cookTimeUnit={initialValue?.cookTimeUnit} />
        <PreparationTimeInput prepTimeMagnitude={initialValue?.prepTimeMagnitude} prepTimeUnit={initialValue?.prepTimeUnit} />
        <RecipeTagsMultiselect
          initialValues={initialValue?.tags}
          onChange={(tags) => {
            setValue(
              "tagIds",
              tags.map((tag) => tag.id)
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
        <IngredientListInput />
        <TextInput
          label="Instructions"
          defaultValue={initialValue?.instructions}
          onChange={(e) => {
            const { value } = e.target;
            setValue("instructions", value);
          }}
          as="textarea"
        />
        <Button type="submit">Submit</Button>
      </Form>
    </FormProvider>
  );
}

function IngredientListInput() {
  const { control, setValue } = useFormContext<RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients", keyName: "ingredientFieldId" });

  return (
    <div>
      <div>
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
        onClick={() =>
          append({
            productCategories: [],
            quantity: 0,
            weightUnit: null,
            volumeUnit: null,
            approximateUnit: null,
          })
        }
      >
        Add Ingredient
      </Button>
      <Button
        type="button"
        onClick={() => {
          remove(fields.length - 1);
        }}
      >
        Remove Ingredient
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
