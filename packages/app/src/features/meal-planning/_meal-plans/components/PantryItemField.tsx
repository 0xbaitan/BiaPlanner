import "../styles/PantryItemField.scss";

import { CookingMeasurement, CookingMeasurementUnit, IPantryItemWithReservationPresent, Weights, addMeasurements, getCookingMeasurement } from "@biaplanner/shared";
import { useCallback, useMemo, useState } from "react";

import CookingMeasurementInput from "@/features/product-catalogue/_products/components/CookingMeasurementInput";
import Form from "react-bootstrap/Form";
import convertCookingMeasurement from "@biaplanner/shared/build/util/CookingMeasurementConversion";
import dayjs from "dayjs";
import { useMealPlanFormActions } from "../../reducers/MealPlanFormReducer";

export type PantryItemFieldProps = {
  pantryItem: IPantryItemWithReservationPresent;
  ingredientId: string;
};

export default function PantryItemField(props: PantryItemFieldProps) {
  const { pantryItem, ingredientId } = props;
  const measurementType = getCookingMeasurement(pantryItem.availableMeasurements?.unit ?? Weights.GRAM).type;

  const { addOrUpdatePortionIngredient, removePortionIngredient, getPortion, getAlreadyReservedPortion } = useMealPlanFormActions();

  const selectedPortion = useMemo(() => {
    const portion = getPortion(pantryItem.id, ingredientId);
    if (portion) {
      return {
        ...portion,
        unit: portion.unit ?? pantryItem.availableMeasurements?.unit,
      };
    }
    return {
      magnitude: 0,
      unit: pantryItem.availableMeasurements?.unit,
    };
  }, [getPortion, ingredientId, pantryItem.id, pantryItem.availableMeasurements?.unit]);

  console.log("selectedPortion", selectedPortion);

  const alreadyReservedPortion = useMemo(() => {
    const portion = getAlreadyReservedPortion(ingredientId, pantryItem.id);
    if (portion) {
      return portion;
    }
    return {
      magnitude: 0,
      unit: pantryItem.availableMeasurements?.unit ?? Weights.GRAM,
    };
  }, [getAlreadyReservedPortion, ingredientId, pantryItem.id, pantryItem.availableMeasurements?.unit]);

  const [selected, setSelected] = useState<boolean>(() => selectedPortion.magnitude > 0);
  const [measurementUnit, setMeasurementUnit] = useState<CookingMeasurementUnit | undefined>(selectedPortion.unit);
  const availableMeasurements = useMemo(
    () => (pantryItem.availableMeasurements && alreadyReservedPortion.magnitude > 0 ? addMeasurements(pantryItem.availableMeasurements, alreadyReservedPortion) : pantryItem.availableMeasurements),
    [alreadyReservedPortion, pantryItem.availableMeasurements]
  );
  const convertedMaxAvailableMeasurement = useMemo(() => {
    if (availableMeasurements) {
      return convertCookingMeasurement(availableMeasurements, measurementUnit ?? availableMeasurements.unit);
    }
    return undefined;
  }, [availableMeasurements, measurementUnit]);

  const convertedSelectedPortion = useMemo(() => {
    if (selectedPortion) {
      return convertCookingMeasurement(
        {
          magnitude: selectedPortion.magnitude,
          unit: selectedPortion.unit ?? availableMeasurements?.unit ?? Weights.GRAM,
        },
        availableMeasurements?.unit ?? Weights.GRAM
      );
    }
    return undefined;
  }, [availableMeasurements, selectedPortion]);

  const constrainPortion = useCallback(
    (portion: CookingMeasurement) => {
      if (availableMeasurements) {
        const availableMagnitude = availableMeasurements.magnitude;
        const availableUnit = availableMeasurements.unit;
        const convertedPortion = convertCookingMeasurement(portion, availableUnit);
        if (convertedPortion.magnitude > availableMagnitude) {
          return {
            ...portion,
            magnitude: availableMagnitude,
            unit: availableUnit,
          };
        }

        if (convertedPortion.magnitude < 0) {
          return {
            ...portion,
            magnitude: 0,
            unit: availableUnit,
          };
        }
        return convertedPortion;
      }
      return portion;
    },
    [availableMeasurements]
  );
  const cookingMeasurementInput = useMemo(() => {
    const targetUnit = availableMeasurements?.unit ?? Weights.GRAM;
    const convertedPortion = convertCookingMeasurement(
      {
        magnitude: selectedPortion.magnitude,
        unit: selectedPortion.unit ?? targetUnit,
      },
      targetUnit
    );

    return (
      <>
        <div className="bp-pantry_item_field__measurement_input">
          <CookingMeasurementInput
            minMagnitude={0}
            maxMagnitude={convertedMaxAvailableMeasurement?.magnitude}
            initialValue={{
              magnitude: convertedSelectedPortion?.magnitude ?? 0,
              unit: convertedSelectedPortion?.unit ?? targetUnit,
            }}
            scoped={measurementType}
            onChange={(value: CookingMeasurement) => {
              addOrUpdatePortionIngredient({
                ingredientId,
                pantryItemId: pantryItem.id,
                portion: constrainPortion(value),
              });
              setMeasurementUnit(value.unit);
              setSelected(true);
            }}
          />
        </div>
        <div className="bp-pantry_item_field__converted_measurement">
          ≈ {convertedPortion.magnitude} {convertedPortion.unit}
        </div>
      </>
    );
  }, [
    availableMeasurements?.unit,
    selectedPortion.magnitude,
    selectedPortion.unit,
    convertedMaxAvailableMeasurement?.magnitude,
    convertedSelectedPortion?.magnitude,
    convertedSelectedPortion?.unit,
    measurementType,
    addOrUpdatePortionIngredient,
    ingredientId,
    pantryItem.id,
    constrainPortion,
  ]);

  return (
    <div className="bp-pantry_item_field">
      <Form.Check
        type="checkbox"
        className="bp-pantry_item_field__checkbox"
        checked={selected}
        onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) {
            removePortionIngredient({
              ingredientId,
              pantryItemId: pantryItem.id,
            });
          } else {
            addOrUpdatePortionIngredient({
              ingredientId,
              pantryItemId: pantryItem.id,
              portion: {
                magnitude: selectedPortion.magnitude,
                unit: selectedPortion.unit ?? pantryItem.availableMeasurements?.unit ?? Weights.GRAM,
              },
            });
          }
        }}
        label={
          <div className="bp-pantry_item_field__details">
            <div className="bp-pantry_item_field__details__name">{pantryItem.product?.name}</div>
            <div className="bp-pantry_item_field__details__expiry">Expires on {dayjs(pantryItem.expiryDate).format("DD/MM/YYYY")}</div>
            <div className="bp-pantry_item_field__details__availability">
              {alreadyReservedPortion.magnitude > 0 ? <span>Net Available: </span> : <span>Available: </span>}
              {availableMeasurements?.magnitude} {availableMeasurements?.unit}
            </div>
            {alreadyReservedPortion.magnitude > 0 && (
              <div className="bp-pantry_item_field__details__availability">
                Already reserved: {alreadyReservedPortion.magnitude} {alreadyReservedPortion.unit}
              </div>
            )}
          </div>
        }
      />
      {selected && cookingMeasurementInput}
    </div>
  );
}
