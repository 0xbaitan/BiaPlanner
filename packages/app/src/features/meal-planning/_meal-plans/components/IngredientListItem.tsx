import "../styles/IngredientListItem.scss";

import { useGetPortionFulfilledStatus, useSelectIngredient, useSelectedPantryItems } from "../../reducers/IngredientManagementReducer";

import Button from "react-bootstrap/esm/Button";
import { FaPencil } from "react-icons/fa6";
import Heading from "@/components/Heading";
import { IRecipeIngredient } from "@biaplanner/shared";
import { ImEnlarge2 } from "react-icons/im";
import { ImShrink2 } from "react-icons/im";
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
        {selectedPantryItems.map((portion, index) => (
          <div key={index}>
            <div>{index + 1}</div>
            <div>{portion.pantryItem?.product?.name ?? "N/A"}</div>
            <div>
              {portion.portion.magnitude} {portion.portion.unit}
            </div>
            <div> (expires in {dayjs(portion.pantryItem?.expiryDate).diff(dayjs(), "days")} days)</div>
          </div>
        ))}
      </div>
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
