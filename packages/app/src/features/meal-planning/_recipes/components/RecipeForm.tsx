import { ICreateRecipeDto, IRecipe, IUpdateRecipeDto } from "@biaplanner/shared";

import CuisineSelect from "./CuisineSelect";
import DifficultyLevelSelect from "./DifficultyLevelSelect";
import Form from "react-bootstrap/Form";
import TextInput from "@/components/forms/TextInput";
import TimeInput from "@/components/forms/TimeInput";

export type RecipeFormValues = ICreateRecipeDto | IUpdateRecipeDto;

export type RecipeFormProps = {
  initialValue?: IRecipe;
  onSubmit: (values: RecipeFormValues) => void;
};
export default function RecipeForm(props: RecipeFormProps) {
  const { initialValue } = props;
  return (
    <div>
      <h1>Recipe Form</h1>
      <TextInput label="Recipe Title" defaultValue={initialValue?.title} onChange={(e) => console.log(e.target.value)} />
      <DifficultyLevelSelect onChange={(value) => console.log(value)} />
      <CuisineSelect onChange={(value) => console.log(value)} />
      <CookingTimeInput cookTimeMagnitude={initialValue?.cookTimeMagnitude} cookTimeUnit={initialValue?.cookTimeUnit} />
      <PreparationTimeInput prepTimeMagnitude={initialValue?.prepTimeMagnitude} prepTimeUnit={initialValue?.prepTimeUnit} />
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
