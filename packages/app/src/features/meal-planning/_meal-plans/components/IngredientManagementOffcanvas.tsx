import "../styles/IngredientManagementOffcanvas.scss";

import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useDeselectIngredient, useIngredientManagementState, useIngredientPantryPortionItemActions } from "../../reducers/IngredientManagementReducer";
import { useGetIngredientCompatiblePantryItemsQuery, useLazyGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";

import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/Offcanvas";
import PantryItemField from "./PantryItemField";
import { useEffect } from "react";

export default function IngredientManagementOffcanvas() {
  const { selectedIngredient, showIngredientManagementOffcanvas: show } = useIngredientManagementState();
  const targetMeasurement = selectedIngredient?.measurement;
  const {
    data: pantryItems,
    isLoading,
    isError,
    isSuccess,
  } = useGetIngredientCompatiblePantryItemsQuery(
    {
      ingredientId: String(selectedIngredient?.id),
      measurementType: getCookingMeasurement(targetMeasurement?.unit ?? Weights.GRAM).type,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      skip: !selectedIngredient?.id || !targetMeasurement,
    }
  );
  const { getSummedPortion } = useIngredientPantryPortionItemActions();
  const delesectIngredient = useDeselectIngredient();
  const selectedPortion = getSummedPortion(selectedIngredient?.id ?? "");
  const requiredPortion = selectedIngredient?.measurement;

  return (
    <Offcanvas show={show} onHide={delesectIngredient} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton className="bp-ingredient_management_offcanvas__header">
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Select portions from your pantry</Heading>
          <Heading level={Heading.Level.H3}>For {selectedIngredient?.title ?? "N/A"}</Heading>
          <div className="bp-ingredient_management_offcanvas__header__pills">
            <div className="bp-ingredient_management_offcanvas__header__portion_status_pill">
              {selectedPortion.magnitude} / {requiredPortion?.magnitude} {selectedPortion.unit} selected
            </div>
            <PortionFullfilmentStatusPill required={requiredPortion?.magnitude ?? 0} selected={selectedPortion.magnitude} />
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}
          {isSuccess && selectedIngredient && pantryItems?.map((item) => <PantryItemField key={item.id} pantryItem={item} ingredientId={selectedIngredient.id} />)}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

type PortionFullfilmentStatusPillProps = {
  required: number;
  selected: number;
};
function PortionFullfilmentStatusPill(props: PortionFullfilmentStatusPillProps) {
  const { required, selected } = props;
  const status = selected < required ? "unfulfilled" : selected === required ? "fulfilled" : "overfulfilled";
  return (
    <div className={["bp-portion_status_pill", status].join(" ")}>
      {status === "unfulfilled" && (
        <div>
          <FaExclamationTriangle />
          <span className="bp-portion_status_pill__status_text">Insufficient portions selected</span>
        </div>
      )}
      {status === "fulfilled" && (
        <div>
          <FaCheckCircle />
          <span className="bp-portion_status_pill__status_text">Sufficient portions selected</span>
        </div>
      )}
      {status === "overfulfilled" && (
        <div>
          <FaExclamationTriangle />
          <span className="bp-portion_status_pill__status_text">Excessive portions selected</span>
        </div>
      )}
    </div>
  );
}
