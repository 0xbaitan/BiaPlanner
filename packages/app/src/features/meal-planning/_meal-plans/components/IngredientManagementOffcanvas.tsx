import "../styles/IngredientManagementOffcanvas.scss";

import { IPantryItem, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useDeselectIngredient, useIngredientManagementState, useIngredientPantryPortionItemActions } from "../../reducers/IngredientManagementReducer";
import { useEffect, useMemo, useState } from "react";

import CookingMeasurementInput from "@/features/admin/_products/components/CookingMeasurementInput";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/Offcanvas";
import dayjs from "dayjs";
import { useLazyGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";

export default function IngredientManagementOffcanvas() {
  const { selectedIngredient, showIngredientManagementOffcanvas: show } = useIngredientManagementState();
  const targetMeasurement = selectedIngredient?.measurement;
  const [getIngredientCompatiblePantryItems, { data: pantryItems, isLoading, isError, isSuccess }] = useLazyGetIngredientCompatiblePantryItemsQuery();
  const { getSumedPortionQuantity } = useIngredientPantryPortionItemActions();
  const delesectIngredient = useDeselectIngredient();
  const portionQuanity = getSumedPortionQuantity(selectedIngredient?.id ?? "");

  useEffect(() => {
    if (selectedIngredient) {
      getIngredientCompatiblePantryItems({
        ingredientId: selectedIngredient.id,
        measurementType: getCookingMeasurement(targetMeasurement?.unit ?? Weights.GRAM).type,
      });
    }
  }, [selectedIngredient, getIngredientCompatiblePantryItems, targetMeasurement?.unit]);

  return (
    <Offcanvas show={show} onHide={delesectIngredient} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton className="bp-ingredient_management_offcanvas__header">
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Select portions from your pantry</Heading>
          <Heading level={Heading.Level.H3}>For {selectedIngredient?.title ?? "N/A"}</Heading>
          <Heading level={Heading.Level.H4}>
            Summed: {portionQuanity.magnitude} {portionQuanity.unit}{" "}
          </Heading>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {selectedIngredient?.title ?? "Empty"}

        <div>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}
          {isSuccess && selectedIngredient && pantryItems?.map((item) => <PantryItemField key={item.id} pantryItem={item} ingredientId={selectedIngredient.id} />)}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

type PantryItemFieldProps = {
  pantryItem: IPantryItem;
  ingredientId: string;
};

function PantryItemField(props: PantryItemFieldProps) {
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
        <div>
          {convertedPortionMagnitude} {convertedPortionUnit}
        </div>
      </>
    );
  }, [pantryItem, portionMagnitude, portionUnit, measurementType, convertedPortionMagnitude, convertedPortionUnit, removePantryItemPortionFromIngredient, ingredientId, addPantryItemPortionToIngredient]);

  return (
    <>
      <Form.Check
        type="checkbox"
        checked={selected}
        onChange={(e) => {
          setSelected(e.target.checked);
          if (!e.target.checked) {
            removePantryItemPortionFromIngredient(ingredientId, pantryItem.id);
          }
        }}
        className="bp-pantry_item_field"
        label={
          <div>
            <div>{pantryItem.product?.name}</div>
            <div>Expires on {dayjs(pantryItem.expiryDate).format("DD/MM/YYYY HH:mm:ss")}</div>
            <div>
              Available: {pantryItem.availableMeasurements?.magnitude} {pantryItem.availableMeasurements?.unit}
            </div>
          </div>
        }
      />
      {selected && cookingMeasurementInput}
    </>
  );
}
