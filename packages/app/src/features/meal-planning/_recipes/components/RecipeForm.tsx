import { DeepPartial, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { IRecipe, IRecipeIngredient } from "@biaplanner/shared";

import Button from "react-bootstrap/Button";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import Form from "react-bootstrap/Form";
import IngredientInput from "./IngredientInput";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import TextInput from "@/components/forms/TextInput";
import TimeInput from "@/components/forms/TimeInput";

export type RecipeFormValues = DeepPartial<IRecipe>;

export type RecipeFormProps = {
  initialValue?: IRecipe;
  onSubmit: (values: RecipeFormValues) => void;
};
export default function RecipeForm(props: RecipeFormProps) {
  const { initialValue } = props;
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

  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit((values) => console.log(values))}>
        <h1>Recipe Form</h1>
        <TextInput label="Recipe Title" defaultValue={initialValue?.title} onChange={(e) => console.log(e.target.value)} />
        <DifficultyLevelSelect onChange={(value) => console.log(value)} />
        <CuisineSelect onChange={(value) => console.log(value)} />
        <CookingTimeInput cookTimeMagnitude={initialValue?.cookTimeMagnitude} cookTimeUnit={initialValue?.cookTimeUnit} />
        <PreparationTimeInput prepTimeMagnitude={initialValue?.prepTimeMagnitude} prepTimeUnit={initialValue?.prepTimeUnit} />
        <RecipeTagsMultiselect initialValues={initialValue?.tags} onChange={(tags) => console.log(tags)} />
        <TextInput label="Recipe Description" defaultValue={initialValue?.description} onChange={(e) => console.log(e.target.value)} as="textarea" />
        <IngredientListInput />
        <TextInput label="Instructions" defaultValue={initialValue?.instructions} onChange={(e) => console.log(e.target.value)} as="textarea" />
      </Form>
    </FormProvider>
  );
}

function IngredientListInput() {
  const { control } = useFormContext<RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients", keyName: "ingredientFieldId" });

  return (
    <div>
      <div>
        {fields.map((field) => {
          const { ingredientFieldId, ...ingredient } = field;
          return <IngredientInput key={ingredientFieldId} initialValue={ingredient as IRecipeIngredient} onChange={(value) => console.log(value)} />;
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

  return (
    <Form.Group>
      <Form.Label>Cooking Time</Form.Label>
      <TimeInput defaultMagnitude={cookTimeMagnitude} defaultUnit={cookTimeUnit} onChange={(magnitude, unit) => console.log(magnitude, unit)} />
      <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
    </Form.Group>
  );
}

function PreparationTimeInput(props: Partial<Pick<IRecipe, "prepTimeMagnitude" | "prepTimeUnit">>) {
  const { prepTimeMagnitude, prepTimeUnit } = props;

  return (
    <Form.Group>
      <Form.Label>Preparation Time</Form.Label>
      <TimeInput defaultMagnitude={prepTimeMagnitude} defaultUnit={prepTimeUnit} onChange={(magnitude, unit) => console.log(magnitude, unit)} />
      <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
    </Form.Group>
  );
}
