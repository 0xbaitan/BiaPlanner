import "../styles/IngredientListItem.scss";

import { useGetPortionFulfilledStatus, useSelectIngredient } from "../../reducers/IngredientManagementReducer";

import Button from "react-bootstrap/esm/Button";
import { FaPencil } from "react-icons/fa6";
import { IRecipeIngredient } from "@biaplanner/shared";
import { ImEnlarge2 } from "react-icons/im";
import { ImShrink2 } from "react-icons/im";
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
      <div className={["bp-ingredient_list_item__products", isExpanded ? "expanded" : ""].join(" ")}>Products</div>
    </>
  );
}

function PortionFulfilledMeter(props: PortionFulfilledMeterProps) {
  const { ingredientId } = props;
  const getPortionFulfilledStatus = useGetPortionFulfilledStatus();
  const status = getPortionFulfilledStatus(ingredientId);

  if (!status) return null;

  const { required, selected, unit } = status;
  const remaining = required - selected;
  const fulfilled = `${selected}/${required} ${unit} ${remaining > 0 ? `(${remaining} remaining)` : ""}`;

  return (
    <div className="bp-portion_fulfilled_meter">
      <div>{fulfilled}</div>
    </div>
  );
}
