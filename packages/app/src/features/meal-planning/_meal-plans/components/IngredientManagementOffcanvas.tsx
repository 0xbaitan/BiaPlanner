import "../styles/IngredientManagementOffcanvas.scss";

import { CookingMeasurement, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useExtendedMealPlanFormState, useMealPlanFormActions } from "../../reducers/MealPlanFormReducer";

import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/Offcanvas";
import PantryItemField from "./PantryItemField";
import { useGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";
import { useMemo } from "react";

export default function IngredientManagementOffcanvas() {
  const { selectedIngredient, isIngredientManagementOffcanvasVisible, formValue } = useExtendedMealPlanFormState();
  console.log(formValue.confirmedIngredients);
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
      existingConcreteIngredientId: "47",
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      skip: !selectedIngredient?.id || !targetMeasurement,
    }
  );

  const { getSummedPortion, hideIngredientManagementOffcanvas } = useMealPlanFormActions();

  const summedPortion: CookingMeasurement | undefined = useMemo(() => {
    const ingredientId = selectedIngredient?.id;
    const measurementUnit = selectedIngredient?.measurement?.unit;
    if (!ingredientId || !measurementUnit) {
      return undefined;
    }
    const summed = getSummedPortion(ingredientId, measurementUnit);
    return summed;
  }, [getSummedPortion, selectedIngredient?.id, selectedIngredient?.measurement?.unit]);

  const requiredPortion = selectedIngredient?.measurement;

  return (
    <Offcanvas show={isIngredientManagementOffcanvasVisible} onHide={hideIngredientManagementOffcanvas} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton className="bp-ingredient_management_offcanvas__header">
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Select portions from your pantry</Heading>
          <Heading level={Heading.Level.H3}>For {selectedIngredient?.title ?? "N/A"}</Heading>
          <div className="bp-ingredient_management_offcanvas__header__pills">
            <div className="bp-ingredient_management_offcanvas__header__portion_status_pill">
              <span className="bp-ingredient_management_offcanvas__header__portion_status_pill__text">Selected portions:</span>
              <span className="bp-ingredient_management_offcanvas__header__portion_status_pill__value">{summedPortion?.magnitude ?? 0}</span>
              <span className="bp-ingredient_management_offcanvas__header__portion_status_pill__unit">{summedPortion?.unit}</span>
            </div>
            <PortionFullfilmentStatusPill required={requiredPortion?.magnitude ?? 0} selected={summedPortion?.magnitude ?? 0} />
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
