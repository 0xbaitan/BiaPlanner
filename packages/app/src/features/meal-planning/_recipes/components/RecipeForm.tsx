import { IRecipe, IWriteRecipeDto } from "@biaplanner/shared";
import { useCallback, useEffect, useMemo } from "react";
import { useRecipeFormActions, useRecipeFormState } from "../../reducers/RecipeFormReducer";

import { Button } from "react-bootstrap";
import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import ImageSelector from "@/components/forms/ImageSelector";
import IngredientList from "../../_meal-plans/components/IngredientList";
import IngredientModal from "./IngredientModal";
import InputLabel from "@/components/forms/InputLabel";
import { MdCancel } from "react-icons/md";
import RecipeTagsMultiselect from "./RecipeTagsMultiselect";
import SegmentedTimeInput from "@/components/forms/SegmentedTimeInput";
import TextInput from "@/components/forms/TextInput";
import { useNavigate } from "react-router-dom";

export type RecipeFormProps = {
  initialValue?: IRecipe;
  onSubmit: (dto: IWriteRecipeDto) => void;
  type: "create" | "update";
  disableSubmit?: boolean;
};

export default function RecipeForm(props: RecipeFormProps) {
  const { initialValue, onSubmit, type, disableSubmit } = props;
  const { formValues, formErrors } = useRecipeFormState();
  const { resetForm, setFormValues, validateForm, clearFormErrors, setFields } = useRecipeFormActions();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValue) {
      setFormValues(initialValue);
    }
    return () => {
      resetForm();
    };
  }, [initialValue, resetForm, setFormValues]);

  const handleSubmit = useCallback(() => {
    const validationSucces = validateForm(formValues);
    if (!validationSucces) {
      console.log("Validation failed");
      return;
    }
    clearFormErrors();
    onSubmit(formValues);
  }, [clearFormErrors, formValues, onSubmit, validateForm]);

  const handleTitleChange = useCallback((e) => setFields({ title: e.target.value }), [setFields]);
  const handleDifficultyChange = useCallback((difficultyLevel) => setFields({ difficultyLevel }), [setFields]);
  const handleCuisineChange = useCallback((cuisine) => setFields({ cuisine: { id: cuisine.id } }), [setFields]);
  const handlePrepTimeChange = useCallback((segmentedTime) => setFields({ prepTime: segmentedTime }), [setFields]);
  const handleCookingTimeChange = useCallback((segmentedTime) => setFields({ cookingTime: segmentedTime }), [setFields]);
  const handleTagsChange = useCallback((tags) => setFields({ tags }), [setFields]);
  const handleDescriptionChange = useCallback((e) => setFields({ description: e.target.value }), [setFields]);
  const handleInstructionsChange = useCallback((e) => setFields({ instructions: e.target.value }), [setFields]);

  return (
    <div>
      <IngredientModal />
      <DualPaneForm onSubmit={handleSubmit} className="bp-recipe_form">
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
              <TextInput label="Recipe title" defaultValue={formValues?.title} inputLabelProps={{ required: true }} error={formErrors?.title?._errors?.[0]} onChange={handleTitleChange} />
              <DifficultyLevelSelect onChange={handleDifficultyChange} initialValue={formValues?.difficultyLevel} inputLabelProps={{ required: true }} error={formErrors?.difficultyLevel?._errors?.[0]} />
              <CuisineSelect onChange={handleCuisineChange} defaultValue={formValues?.cuisine} inputLabelProps={{ required: true }} error={formErrors?.cuisine?._errors?.[0]} />
              <Form.Group>
                <InputLabel required>Preparation time</InputLabel>
                <SegmentedTimeInput
                  onChange={handlePrepTimeChange}
                  initialValue={
                    formValues?.prepTime ?? {
                      days: 0,
                      hours: 0,
                      minutes: 0,
                      seconds: 0,
                    }
                  }
                />
              </Form.Group>
              <Form.Group>
                <InputLabel required>Cooking time</InputLabel>
                <SegmentedTimeInput
                  onChange={handleCookingTimeChange}
                  initialValue={
                    formValues?.cookingTime ?? {
                      days: 0,
                      hours: 0,
                      minutes: 0,
                      seconds: 0,
                    }
                  }
                />
              </Form.Group>
              <RecipeTagsMultiselect inputLabelProps={{ required: true }} initialValue={initialValue?.tags ?? []} onChange={handleTagsChange} error={formErrors?.tags?._errors?.[0]} />
              <TextInput label="Recipe Description" defaultValue={formValues?.description} onChange={handleDescriptionChange} as="textarea" />
            </div>
          </DualPaneForm.Panel.Pane>
          <DualPaneForm.Panel.Pane>
            <Heading level={Heading.Level.H2}>Ingredients</Heading>
            <IngredientList />
            <TextInput formGroupClassName="mt-5" label="Instructions" defaultValue={initialValue?.instructions} onChange={handleInstructionsChange} as="textarea" />
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </div>
  );
}
