import { CookingMeasurement, IConcreteIngredient, ICreatePantryItemPortionDto, IRecipeIngredient, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useCallback, useMemo, useReducer } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

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
  const { control, setValue, getValues } = useFormContext<ConcreteRecipeFormValues>();
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

  const [pantryItemsWithPortions, setPantryItemsWithPortions] = useReducer((state: Record<string, ICreatePantryItemPortionDto>, action: { type: "add" | "remove"; key: string; payload?: ICreatePantryItemPortionDto }) => {
    switch (action.type) {
      case "add":
        if (!action.payload) {
          return state;
        }
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

  const getFilteredPantryItemsList = useCallback(
    (pantryItemFieldIndex: number) => {
      const selectedPantryItemIdForCurrentField = getValues(`confirmedIngredients.${index}.pantryItemsWithPortions.${pantryItemFieldIndex}.pantryItemId`);
      const selectedPantryItemIdsExcludingCurrent =
        getValues(`confirmedIngredients.${index}.pantryItemsWithPortions`)
          ?.map((item) => item.pantryItemId)
          .filter((id) => id !== selectedPantryItemIdForCurrentField) ?? [];
      const unselectedPantryItems = applicablePantryItems?.filter((item) => !selectedPantryItemIdsExcludingCurrent.includes(item.id)) ?? [];
      return unselectedPantryItems;
    },
    [applicablePantryItems, getValues, index]
  );

  const checkDisableEligibity = useCallback(() => {
    const nextPantryItemFieldIndex = pantryItemPortionFields.length;
    return getFilteredPantryItemsList(nextPantryItemFieldIndex).length === 0 && nextPantryItemFieldIndex > 0;
  }, [getFilteredPantryItemsList, pantryItemPortionFields.length]);

  const getInitialPantryItem = useCallback(
    (pantryItemFieldIndex: number) => {
      const pantryItems = getFilteredPantryItemsList(pantryItemFieldIndex);
      if (pantryItems.length === 0) {
        return undefined;
      }
      const selectedPantryItem = pantryItems[0];
      return selectedPantryItem;
    },
    [getFilteredPantryItemsList]
  );
  const addPantryItem = useCallback(() => {
    const nextPantryItemFieldIndex = pantryItemPortionFields.length;
    const selectedPantryItem = getInitialPantryItem(nextPantryItemFieldIndex);
    appendPantryItemPortionField({
      pantryItemId: selectedPantryItem?.id!,
      portion: {
        magnitude: 0,
        unit: targetMeasurement?.unit!,
      },
    });
  }, [appendPantryItemPortionField, getInitialPantryItem, pantryItemPortionFields.length, targetMeasurement?.unit]);

  const pantryItemPortionComponents = useMemo(() => {
    return pantryItemPortionFields.map((field, fieldIndex) => {
      const { pantryItemPortionFieldId } = field;
      return (
        <div key={pantryItemPortionFieldId}>
          <ConcreteIngredientPantryItemSelect
            ingredientMeasurementUnit={recipeIngredient.measurement?.unit!}
            initialValue={getInitialPantryItem(fieldIndex)}
            list={getFilteredPantryItemsList(fieldIndex)}
            onChange={({ pantryItem, measurement }) => {
              const pantryItemWithPortion: ICreatePantryItemPortionDto = {
                pantryItemId: pantryItem.id,
                portion: measurement,
              };
              setValue(`confirmedIngredients.${index}.pantryItemsWithPortions.${fieldIndex}`, pantryItemWithPortion);
              setPantryItemsWithPortions({ type: "add", payload: pantryItemWithPortion, key: pantryItemPortionFieldId });
            }}
          />
          <Button
            onClick={() => {
              removePantryItemPortionField(fieldIndex);
              setPantryItemsWithPortions({ type: "remove", key: pantryItemPortionFieldId });
            }}
          >
            Remove
          </Button>
        </div>
      );
    });
  }, [getFilteredPantryItemsList, getInitialPantryItem, index, pantryItemPortionFields, recipeIngredient.measurement?.unit, removePantryItemPortionField, setValue]);

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
      <div>
        Requirement: {recipeIngredient.measurement?.magnitude} {recipeIngredient.measurement?.unit}
      </div>
      <div>
        Summed portion: {summedPortion.magnitude} {summedPortion.unit}
      </div>
      <div>{summedPortion.magnitude < recipeIngredient.measurement?.magnitude! ? <p>Not enough portion</p> : summedPortion.magnitude > recipeIngredient.measurement?.magnitude! ? <p>Too much portion</p> : <p>Just right</p>}</div>
      {pantryItemPortionComponents}
      <Button disabled={checkDisableEligibity()} onClick={addPantryItem}>
        Add from another pantry item
      </Button>
    </div>
  );
}
