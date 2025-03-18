import "../styles/IngredientManagementOffcanvas.scss";

import { IPantryItem, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { selectIngredient, useDeselectIngredient, useIngredientManagementState } from "../../reducers/IngredientManagementReducer";
import { useGetIngredientCompatiblePantryItemsQuery, useLazyGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";

import CookingMeasurementInput from "@/features/admin/_products/components/CookingMeasurementInput";
import Form from "react-bootstrap/Form";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/Offcanvas";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function IngredientManagementOffcanvas() {
  const { selectedIngredient, showIngredientManagementOffcanvas: show } = useIngredientManagementState();
  const targetMeasurement = selectedIngredient?.measurement;
  const [getIngredientCompatiblePantryItems, { data: pantryItems, isLoading, isError, isSuccess }] = useLazyGetIngredientCompatiblePantryItemsQuery();

  const delesectIngredient = useDeselectIngredient();

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
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {selectedIngredient?.title ?? "Empty"}

        <div>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}
          {isSuccess && pantryItems?.map((item) => <PantryItemField key={item.id} pantryItem={item} />)}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

type PantryItemFieldProps = {
  pantryItem: IPantryItem;
};

function PantryItemField(props: PantryItemFieldProps) {
  const { pantryItem } = props;
  const measurementType = getCookingMeasurement(pantryItem.availableMeasurements?.unit ?? Weights.GRAM).type;

  return (
    <>
      <Form.Check
        type="checkbox"
        className="bp-pantry_item_field"
        label={
          <div>
            <div>{pantryItem.product?.name}</div>
            <div>Expires on {dayjs(pantryItem.expiryDate).format("DD/MM/YYYY HH:mm:ss")}</div>
            <div>
              Available: {pantryItem.availableMeasurements?.magnitude} {pantryItem.availableMeasurements?.unit}
            </div>
            <div></div>
          </div>
        }
      />
      <CookingMeasurementInput
        minMagnitude={0}
        maxMagnitude={pantryItem.availableMeasurements?.magnitude ?? 0}
        initialValue={{
          magnitude: 0,
          unit: pantryItem.availableMeasurements?.unit ?? Weights.GRAM,
        }}
        scoped={measurementType}
        onChange={(measurement) => console.log(measurement)}
      />
    </>
  );
}
