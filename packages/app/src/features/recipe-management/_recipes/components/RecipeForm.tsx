import "../styles/RecipeForm.scss";

import { DifficultyLevels, IRecipe, IWriteRecipeDto, Weights, WriteRecipeValidationSchema } from "@biaplanner/shared";
import { FormProvider, useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo } from "react";

import { Button } from "react-bootstrap";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import ImageSelector from "@/components/forms/ImageSelector";
import IngredientList from "./IngredientList";
import InputLabel from "@/components/forms/InputLabel";
import { MdCancel } from "react-icons/md";
import React from "react";
import RecipeDirectionList from "./RecipeDirectionList";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import SegmentedTimeInput from "@/components/forms/SegmentedTimeInput";
import TextInput from "@/components/forms/TextInput";
import { serialize } from "object-to-formdata";
import { useNavigate } from "react-router-dom";
import useValidationErrorToast from "@/components/toasts/ValidationErrorToast";
import { zodResolver } from "@hookform/resolvers/zod";

export type RecipeFormProps = {
  initialValue?: IRecipe;
  onSubmit: (dto: IWriteRecipeDto, data: FormData) => Promise<boolean>;
  type: "create" | "update";
  disableSubmit?: boolean;
};

function convertToFormData(data: IWriteRecipeDto): FormData {
  const serializedData = serialize(data, { indices: true, nullsAsUndefineds: true, allowEmptyArrays: true, dotsForObjectNotation: true });
  return serializedData;
}

function getDefaultValues(recipe: IRecipe | undefined): IWriteRecipeDto {
  if (!recipe) {
    return {
      title: "",
      description: "",

      prepTime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      cookingTime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      file: undefined,

      difficultyLevel: DifficultyLevels.EASY,
      cuisine: {
        id: "1",
      },
      tags: [],
      ingredients: [],
      directions: [],
    };
  }
  const defaultValues: IWriteRecipeDto = {
    title: recipe.title,
    description: recipe.description,

    prepTime: recipe.prepTime,
    cookingTime: recipe.cookingTime,

    difficultyLevel: recipe.difficultyLevel as DifficultyLevels,
    cuisine: {
      id: recipe.cuisine.id,
    },
    tags:
      recipe.tags?.map((tag) => ({
        id: tag.id,
      })) ?? [],

    ingredients: recipe.ingredients.map((ingredient) => ({
      title: ingredient.title || "", // Ensure title is always a string
      productCategories: ingredient.productCategories.map((category) => ({
        id: category.id,
      })),
      measurement: ingredient.measurement || { magnitude: 0, unit: Weights.GRAM }, // Provide default measurement
      id: ingredient.id,
      recipeId: ingredient.recipeId,
    })),
    file: undefined,
    directions:
      recipe.directions?.map((direction) => ({
        order: direction.order,
        text: direction.text,
      })) ?? [],
  };
  return defaultValues;
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
  const transformedInitialValue = useMemo(() => getDefaultValues(initialValue), [initialValue]);
  const [coverImageFile, setCoverImageFile] = React.useState<File | undefined>(undefined);
  const navigate = useNavigate();
  const methods = useForm<IWriteRecipeDto>({
    defaultValues: transformedInitialValue,
    resolver: zodResolver(WriteRecipeValidationSchema),
    mode: "onChange",
  });
  const { handleSubmit, reset, setValue, watch, formState } = methods;

  useEffect(() => {
    if (!!initialValue) {
      reset(initialValue);
    }
  }, [initialValue, reset]);

  const handleFormSubmit = useCallback(
    async (values: IWriteRecipeDto) => {
      const formData = convertToFormData({ ...values, file: coverImageFile });
      return onSubmit(values, formData);
    },
    [coverImageFile, onSubmit]
  );

  const { onSubmitError } = useValidationErrorToast();

  const handleImageChange = useCallback(
    (file: File | undefined) => {
      setValue("file", file);
      setCoverImageFile(file);
    },
    [setValue]
  );

  return (
    <FormProvider {...methods}>
      <div className="bp-recipe_form">
        <DualPaneForm onSubmit={handleSubmit(handleFormSubmit, onSubmitError)}>
          <DualPaneForm.Header className="bp-recipe_form__header">
            <DualPaneForm.Header.Title className="bp-recipe_form__header__title">{type === "create" ? "Create Recipe" : "Edit Recipe"}</DualPaneForm.Header.Title>
            <DualPaneForm.Header.Actions className="bp-recipe_form__header__actions">
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
          <DualPaneForm.Panel className="bp-recipe_form__dual_pane">
            <DualPaneForm.Panel.Pane className="bp-recipe_form__dual_pane__pane">
              <Heading level={Heading.Level.H2}>General Information</Heading>
              <MemoizedImageSelector
                className="bp-recipe_form__image_selector"
                value={coverImageFile}
                valueMetadata={initialValue?.coverImage}
                onChange={handleImageChange}
                helpText="Upload an optional cover image for this recipe. Recommended image dimensions are 1200 x 800 px."
              />
              <div className="bp-recipe_form__general_info">
                <MemoizedTextInput {...methods.register("title")} label="Recipe title" name="title" inputLabelProps={{ required: true }} placeholder="Enter recipe title" error={formState.errors?.title?.message} />

                <MemoizedTextInput
                  label="Recipe Description (optional)"
                  value={watch("description") ?? undefined}
                  name="description"
                  as="textarea"
                  onChange={(e) => setValue("description", e.target.value)}
                  placeholder="Enter recipe description"
                  error={formState.errors?.description?.message}
                />

                <MemoizedTextInput label="Recipe Source (optional)" value={watch("source") ?? undefined} name="source" onChange={(e) => setValue("source", e.target.value)} placeholder="Enter recipe source" error={formState.errors?.source?.message} />
                <hr />

                <MemoizedDifficultyLevelSelect
                  onChange={(value) => {
                    setValue("difficultyLevel", value);
                  }}
                  name="difficultyLevel"
                  inputLabelProps={{ required: true }}
                  error={formState.errors?.difficultyLevel?.message}
                />
                <MemoizedCuisineSelect defaultValue={watch("cuisine")} inputLabelProps={{ required: true }} onChange={(cuisine) => setValue("cuisine.id", cuisine.id)} />
                <MemoizedRecipeTagsMultiselect
                  initialValue={watch("tags")}
                  inputLabelProps={{ required: true }}
                  error={formState.errors?.tags?.message}
                  onChange={(tags) =>
                    setValue(
                      "tags",
                      tags.map((tag) => ({ id: tag.id }))
                    )
                  }
                />
                <hr />

                <Form.Group>
                  <InputLabel>Preparation time (optional)</InputLabel>
                  <MemoizedSegmentedTimeInput initialValue={watch("prepTime")} onChange={(value) => setValue("prepTime", value)} />
                </Form.Group>
                <Form.Group>
                  <InputLabel>Cooking time (optional)</InputLabel>
                  <MemoizedSegmentedTimeInput initialValue={watch("cookingTime")} onChange={(value) => setValue("cookingTime", value)} />
                </Form.Group>
              </div>
            </DualPaneForm.Panel.Pane>
            <DualPaneForm.Panel.Pane className="bp-recipe_form__dual_pane__pane">
              <div className="bp-recipe_form__ingredients">
                <MemoizedIngredientList />
              </div>

              <div className="bp-recipe_form__directions">
                <RecipeDirectionList directions={watch("directions")} />
              </div>
            </DualPaneForm.Panel.Pane>
          </DualPaneForm.Panel>
        </DualPaneForm>
      </div>
    </FormProvider>
  );
}
