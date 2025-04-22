import { DifficultyLevels, IRecipe, IWriteRecipeDto, Weights, WriteRecipeValidationSchema } from "@biaplanner/shared";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

import { Button } from "react-bootstrap";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import ImageSelector from "@/components/forms/ImageSelector";
import IngredientItem from "./IngredientItem";
import IngredientList from "./IngredientList";
import IngredientModal from "./IngredientModal";
import InputLabel from "@/components/forms/InputLabel";
import { MdCancel } from "react-icons/md";
import React from "react";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import SegmentedTimeInput from "@/components/forms/SegmentedTimeInput";
import TextInput from "@/components/forms/TextInput";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export type RecipeFormProps = {
  initialValue?: IRecipe;
  onSubmit: (dto: IWriteRecipeDto) => void;
  type: "create" | "update";
  disableSubmit?: boolean;
};

function convertRecipeToDto(recipe?: IRecipe): IWriteRecipeDto {
  if (!recipe) {
    return {
      title: "",
      difficultyLevel: DifficultyLevels.EASY,
      cuisine: { id: "1" },
      prepTime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      cookingTime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      tags: [],
      ingredients: [],
      description: "",
      instructions: "",
    };
  }

  return {
    title: recipe.title,
    difficultyLevel: recipe.difficultyLevel ?? DifficultyLevels.EASY,
    cuisine: {
      id: recipe.cuisine?.id,
    },
    ingredients:
      recipe.ingredients?.map((ingredient) => ({
        id: ingredient.id,
        title: ingredient.title || "", // Ensure title is a string
        measurement: ingredient.measurement || { magnitude: 0, unit: Weights.GRAM }, // Provide a default measurement
        productCategories: ingredient.productCategories?.map((category) => ({ id: category.id })) || [],
      })) || [],

    prepTime: recipe.prepTime,
    cookingTime: recipe.cookingTime,
    tags: recipe.tags?.map((tag) => ({ id: tag.id })) || [],
    description: recipe.description,
    instructions: recipe.instructions,
  };
}

const MemoizedTextInput = React.memo(TextInput);

const MemoizedIngredientList = React.memo(IngredientList);

const MemoizedSegmentedTimeInput = React.memo(SegmentedTimeInput);
const MemoizedRecipeTagsMultiselect = React.memo(RecipeTagsMultiselect);
const MemoizedImageSelector = React.memo(ImageSelector);
const MemoizedDifficultyLevelSelect = React.memo(DifficultyLevelSelect);
const MemoizedCuisineSelect = React.memo(CuisineSelect);

export default function RecipeForm(props: RecipeFormProps) {
  const { initialValue, onSubmit, type, disableSubmit } = props;
  const transformedInitialValue = useMemo(() => convertRecipeToDto(initialValue), [initialValue]);
  console.log("transformedInitialValue", transformedInitialValue);
  console.log("initialValue", initialValue);
  const methods = useForm<IWriteRecipeDto>({
    defaultValues: transformedInitialValue,
    resolver: zodResolver(WriteRecipeValidationSchema),
    mode: "onChange",
  });
  const { handleSubmit, reset, setValue, watch, formState } = methods;
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValue) {
      reset(initialValue);
    }
  }, [initialValue, reset]);

  const handleFormSubmit = () => {
    const data = methods.getValues();
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <div>
        <DualPaneForm onSubmit={handleSubmit(handleFormSubmit)} className="bp-recipe_form">
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
              <MemoizedImageSelector helpText="Upload a cover image for this recipe. Recommended image dimensions are 1200 x 800 px." />
              <div className="bp-recipe_form__general_info">
                <MemoizedTextInput label="Recipe title" name="title" value={watch("title")} inputLabelProps={{ required: true }} error={formState.errors?.title?.message} />
                <MemoizedDifficultyLevelSelect
                  onChange={(value) => {
                    setValue("difficultyLevel", value);
                  }}
                  name="difficultyLevel"
                  inputLabelProps={{ required: true }}
                  error={formState.errors?.difficultyLevel?.message}
                />
                <MemoizedCuisineSelect defaultValue={watch("cuisine")} inputLabelProps={{ required: true }} onChange={(cuisine) => setValue("cuisine.id", cuisine.id)} />
                <Form.Group>
                  <InputLabel required>Preparation time</InputLabel>
                  <MemoizedSegmentedTimeInput initialValue={watch("prepTime")} onChange={(value) => setValue("prepTime", value)} />
                </Form.Group>
                <Form.Group>
                  <InputLabel required>Cooking time</InputLabel>
                  <MemoizedSegmentedTimeInput initialValue={watch("cookingTime")} onChange={(value) => setValue("cookingTime", value)} />
                </Form.Group>

                <MemoizedRecipeTagsMultiselect initialValue={watch("tags")} inputLabelProps={{ required: true }} error={formState.errors?.tags?.message} />
                <MemoizedTextInput label="Recipe Description" value={watch("description")} name="description" as="textarea" />
              </div>
            </DualPaneForm.Panel.Pane>
            <DualPaneForm.Panel.Pane>
              <Heading level={Heading.Level.H2}>Ingredients</Heading>
              <MemoizedIngredientList />

              <MemoizedTextInput formGroupClassName="mt-5" label="Instructions" name="instructions" as="textarea" value={watch("instructions")} />
            </DualPaneForm.Panel.Pane>
          </DualPaneForm.Panel>
        </DualPaneForm>
      </div>
    </FormProvider>
  );
}
