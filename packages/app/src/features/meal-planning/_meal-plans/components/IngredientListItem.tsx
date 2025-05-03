import "../styles/IngredientListItem.scss";

import { useGetPortionFulfilledStatus, useSelectIngredient, useSelectedPantryItems } from "../../reducers/IngredientManagementReducer";

import Button from "react-bootstrap/esm/Button";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import Heading from "@/components/Heading";
import { IRecipeIngredient } from "@biaplanner/shared";
import { ImEnlarge2 } from "react-icons/im";
import { ImShrink2 } from "react-icons/im";
import ProgressBar from "react-bootstrap/ProgressBar";
import dayjs from "dayjs";
import { useState } from "react";

export type IngredientListItemProps = {
  ingredient: IRecipeIngredient;
  index: number;
};

type PortionFulfilledMeterProps = {
  ingredientId: string;
};
export default function IngredientListItem(props: IngredientListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ingredient, index } = props;
  const selectIngredient = useSelectIngredient();
  const selectedPantryItems = useSelectedPantryItems(ingredient.id);

  return (
    <>
      <div className="bp-ingredient_list_item">
        <div>{index}</div>
        <div>{ingredient?.title}</div>
        <PortionFulfilledMeter ingredientId={ingredient.id} />
        <div className="bp-ingredient_list_item__actions">
          <Button size="sm" variant="primary" onClick={() => selectIngredient(ingredient)}>
            <FaPencil size={20} className="pe-2" />
            <span>Update products</span>
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? (
              <>
                <ImShrink2 className="pe-2" size={20} />
                <span>Hide products</span>
              </>
            ) : (
              <>
                <ImEnlarge2 className="pe-2" size={20} />
                <span>Show products</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <div className={["bp-ingredient_list_item__products", isExpanded ? "expanded" : ""].join(" ")}>
        <Heading level={Heading.Level.H4}>Selected products and measurements from your pantry</Heading>
        <ol className="bp-ingredient_list_item__products__list">
          {selectedPantryItems.length === 0 && <div className="bp-ingredient_list_item__products__list__no_products_selected">No products selected</div>}
          {selectedPantryItems.length > 0 &&
            selectedPantryItems.map((portion, index) => (
              <li key={index} className="bp-ingredient_list_item__products__list__item">
                <div>{index + 1}.</div>
                <div className="bp-ingredient_list_item__products__list__item__details">
                  <div className="bp-ingredient_list_item__products__list__item__details__name">{portion.pantryItem?.product?.name ?? "N/A"}</div>
                  <div className="bp-ingredient_list_item__products__list__item__details__date_info"> (expires in {dayjs(portion.pantryItem?.expiryDate).diff(dayjs(), "days")} days)</div>
                </div>
                <div>
                  {portion.portion.magnitude} {portion.portion.unit}
                </div>
              </li>
            ))}
        </ol>
      </div>
    </>
  );
}

function PortionFulfilledMeter(props: PortionFulfilledMeterProps) {
  const { ingredientId } = props;
  const getPortionFulfilledStatus = useGetPortionFulfilledStatus();
  const status = getPortionFulfilledStatus(ingredientId);

  if (!status) return <div className="bp-portion_fulfilled_meter">Loading...</div>;

  const { required, selected, unit } = status;
  console.log("Portion fulfilled status", status);
  const remaining = required - selected;

  const percentage = (selected / required) * 100;
  return (
    <div className="bp-portion_fulfilled_meter">
      {remaining > 0 && (
        <div>
          {remaining}
          {unit}&nbsp; remaining
        </div>
      )}
      <ProgressBar now={percentage} />
      {remaining > 0 ? (
        <div>
          <FaExclamationTriangle />
          <span className="ms-2">Insufficient portion selected</span>
        </div>
      ) : (
        <div>
          <span className="bp-portion_fulfilled_meter__status_text">Sufficient portions selected</span>
        </div>
      )}
    </div>
  );
}
