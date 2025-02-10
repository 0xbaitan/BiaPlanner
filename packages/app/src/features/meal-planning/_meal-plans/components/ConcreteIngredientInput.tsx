import { CookingMeasurement, IConcreteIngredient, ICreatePantryItemPortionDto, IRecipeIngredient, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useMemo, useReducer } from "react";

import Button from "react-bootstrap/esm/Button";
import ConcreteIngredientPantryItemSelect from "./ConcreteIngredientPantryItemSelect";
import { ConcreteRecipeFormValues } from "./MealPlanForm";
import convertCookingMeasurement from "@biaplanner/shared/build/util/CookingMeasurementConversion";
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

  const summedPortion = useMemo(() => {
    const totalMagnitude = Object.values(pantryItemsWithPortions)
      .map(({ portion }) => convertCookingMeasurement(portion, targetMeasurement?.unit!))
      .reduce((acc, curr) => acc + curr.magnitude, 0);

    const summedPortion: CookingMeasurement = {
      magnitude: totalMagnitude,
      unit: targetMeasurement?.unit!,
    };
    return summedPortion;
  }, [pantryItemsWithPortions, targetMeasurement]);

  const {
    data: applicablePantryItems,
    isLoading,
    isError,
  } = useGetIngredientCompatiblePantryItemsQuery({
    ingredientId: recipeIngredient.id,
    measurementType: getCookingMeasurement(targetMeasurement?.unit ?? Weights.GRAM).type,
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
  }, [applicablePantryItems, index, pantryItemPortionFields, removePantryItemPortionField, setValue]);

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
      <div>
        Summed portion: {summedPortion.magnitude} {summedPortion.unit}
      </div>
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
