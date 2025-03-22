import "../styles/PantryItemField.scss";

import { IPantryItem, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useMemo, useState } from "react";

import CookingMeasurementInput from "@/features/admin/_products/components/CookingMeasurementInput";
import Form from "react-bootstrap/Form";
import dayjs from "dayjs";
import { useIngredientPantryPortionItemActions } from "../../reducers/IngredientManagementReducer";

export type PantryItemFieldProps = {
  pantryItem: IPantryItem;
  ingredientId: string;
};

export default function PantryItemField(props: PantryItemFieldProps) {
  const { pantryItem, ingredientId } = props;
  const measurementType = getCookingMeasurement(pantryItem.availableMeasurements?.unit ?? Weights.GRAM).type;

  const { addPantryItemPortionToIngredient, removePantryItemPortionFromIngredient, getSelectedPantryItemPortion } = useIngredientPantryPortionItemActions();

  const { convertedPortionMagnitude, convertedPortionUnit, portionMagnitude, portionUnit } = useMemo(() => {
    return getSelectedPantryItemPortion(ingredientId, pantryItem.id);
  }, [getSelectedPantryItemPortion, pantryItem.id, ingredientId]);

  console.log(portionMagnitude, portionUnit);

  const [selected, setSelected] = useState<boolean>(() => portionMagnitude > 0);

  const cookingMeasurementInput = useMemo(() => {
    return (
      <>
        <div className="bp-pantry_item_field__measurement_input">
          <CookingMeasurementInput
            minMagnitude={0}
            maxMagnitude={pantryItem.availableMeasurements?.magnitude ?? 0}
            initialValue={{
              magnitude: portionMagnitude,
              unit: portionUnit,
            }}
            scoped={measurementType}
            onChange={(measurement) => {
              if (measurement.magnitude === 0) {
                removePantryItemPortionFromIngredient(ingredientId, pantryItem.id);
              } else {
                addPantryItemPortionToIngredient(ingredientId, { pantryItemId: pantryItem.id, portion: measurement, pantryItem });
              }
            }}
          />
        </div>
        <div className="bp-pantry_item_field__converted_measurement">
          ≈ {convertedPortionMagnitude} {convertedPortionUnit}
        </div>
      </>
    );
  }, [pantryItem, portionMagnitude, portionUnit, measurementType, convertedPortionMagnitude, convertedPortionUnit, removePantryItemPortionFromIngredient, ingredientId, addPantryItemPortionToIngredient]);

  return (
    <div className="bp-pantry_item_field">
      <Form.Check
        type="checkbox"
        className="bp-pantry_item_field__checkbox"
        checked={selected}
        onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) {
            removePantryItemPortionFromIngredient(ingredientId, pantryItem.id);
          }
        }}
        label={
          <div className="bp-pantry_item_field__details">
            <div className="bp-pantry_item_field__details__name">{pantryItem.product?.name}</div>
            <div className="bp-pantry_item_field__details__expiry">Expires on {dayjs(pantryItem.expiryDate).format("DD/MM/YYYY")}</div>
            <div className="bp-pantry_item_field__details__availability">
              Available: {pantryItem.availableMeasurements?.magnitude} {pantryItem.availableMeasurements?.unit}
            </div>
          </div>
        }
      />
      {selected && cookingMeasurementInput}
    </div>
  );
}
