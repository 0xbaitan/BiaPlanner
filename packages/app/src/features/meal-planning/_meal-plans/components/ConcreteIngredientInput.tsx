import { CookingMeasurement, IConcreteIngredient, ICreateConcreteIngredientDto, ICreatePantryItemPortionDto, IPantryItemPortion, IRecipeIngredient, Weights } from "@biaplanner/shared";
import { DeepPartial, useFieldArray, useFormContext } from "react-hook-form";
import { useMemo, useReducer } from "react";

import Button from "react-bootstrap/esm/Button";
import ConcreteIngredientPantryItemSelect from "./ConcreteIngredientPantryItemSelect";
import { ConcreteRecipeFormValues } from "./MealPlanForm";
import { useGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";

export type ConcreteIngredientInputProps = {
  recipeIngredient: IRecipeIngredient;
  initialValue?: Partial<IConcreteIngredient>;
  onChange: (value: Partial<IConcreteIngredient>) => void;
  index: number;
 
};

export default function ConcreteIngredientInput(props: ConcreteIngredientInputProps) {
  const { recipeIngredient, index } = props;
  const { control, setValue } = useFormContext<ConcreteRecipeFormValues>();
  const {
    fields: pantryItemPortionFields,
    append: appendPantryItemPortionField,
    remove: removePantryItemPortionField,
  } = useFieldArray({
    control,
    name: `confirmedIngredients.${index}.pantryItemsWithPortions`,
    keyName: "pantryItemPortionFieldId",
  });

  const targetMeasurement = recipeIngredient.measurement;

  const [pantryItemsWithPortions, setPantryItemsWithPortions] = useReducer((state: Record<string, ICreatePantryItemPortionDto>, action: { type: "add" | "remove"; key: string; payload: ICreatePantryItemPortionDto }) => {
    switch (action.type) {
      case "add":
        return {
          ...state,
          [action.key]: action.payload,
        };
      case "remove":
        delete state[action.key];
        return { ...state };
      default:
        return state;
    }
  }, {});

  console.log("Aggregate", pantryItemsWithPortions);

  const {
    data: applicablePantryItems,
    isLoading,
    isError,
  } = useGetIngredientCompatiblePantryItemsQuery({
    ingredientId: recipeIngredient.id,
  });

  const pantryItemPortionComponents = useMemo(() => {
    return pantryItemPortionFields.map((field, fieldIndex) => {
      const { pantryItemPortionFieldId } = field;
      return (
        <div key={pantryItemPortionFieldId}>
          <ConcreteIngredientPantryItemSelect
            list={applicablePantryItems ?? []}
            onChange={({ pantryItem, measurement }) => {
              const pantryItemWithPortion: ICreatePantryItemPortionDto = {
                pantryItemId: pantryItem.id,
                portion: measurement,
              };
              setValue(`confirmedIngredients.${index}.pantryItemsWithPortions.${fieldIndex}`, pantryItemWithPortion);
              setPantryItemsWithPortions({ type: "add", payload: pantryItemWithPortion, key: pantryItemPortionFieldId });
            }}
          />
          <Button onClick={() => removePantryItemPortionField(fieldIndex)}>Remove</Button>
        </div>
      );
    });
  }, [applicablePantryItems, pantryItemPortionFields]);

  console.log(applicablePantryItems);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      Ingredient: {recipeIngredient.title}
      Requirement: {recipeIngredient.measurement?.magnitude} {recipeIngredient.measurement?.unit}
      {pantryItemPortionComponents}
      <Button
        onClick={() =>
          appendPantryItemPortionField({
            pantryItemId: "",
            portion: {
              magnitude: 0,
              unit: Weights.GRAM,
            },
          })
        }
      >
        Add from another pantry item
      </Button>
    </div>
  );
}
