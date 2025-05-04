import "../styles/IngredientListItem.scss";

import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { IRecipeIngredient, IWritePantryItemPortionDto, Weights } from "@biaplanner/shared";
import { useExtendedMealPlanFormState, useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import Button from "react-bootstrap/esm/Button";
import { FaPencil } from "react-icons/fa6";
import Heading from "@/components/Heading";
import { ImEnlarge2 } from "react-icons/im";
import { ImShrink2 } from "react-icons/im";
import Pill from "@/components/Pill";
import ProgressBar from "react-bootstrap/ProgressBar";
import dayjs from "dayjs";
import { useGetPantryItemQuery } from "@/apis/PantryItemsApi";
import { useGetRecipeIngredientQuery } from "@/apis/RecipeIngredientsApi";
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

  const { showIngredientManagementOffcanvas } = useMealPlanFormActions();

  return (
    <>
      <div className="bp-ingredient_list_item">
        <div>{index}</div>
        <div>{ingredient?.title}</div>
        <PortionFulfilledMeter ingredientId={ingredient.id} />
        <div className="bp-ingredient_list_item__actions">
          <Button size="sm" variant="primary" onClick={() => showIngredientManagementOffcanvas(ingredient)}>
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
        <SelectedPantryItemsList ingredientId={ingredient.id} />
      </div>
    </>
  );
}

function SelectedPantryItemsList({ ingredientId }: { ingredientId: string }) {
  const { getSelectedPantryItemPortions } = useMealPlanFormActions();
  const selectedPantryItems = getSelectedPantryItemPortions(ingredientId);
  return (
    <>
      <Heading level={Heading.Level.H4}>Selected products and measurements from your pantry</Heading>
      <ol className="bp-ingredient_list_item__products__list">
        {selectedPantryItems.length === 0 && <div className="bp-ingredient_list_item__products__list__no_products_selected">No products selected</div>}
        {selectedPantryItems.length > 0 && selectedPantryItems.map((portion, index) => <SelectedPantryItemDetails key={index} item={portion} index={index} />)}
      </ol>
    </>
  );
}

type SelectedPantryItemDetailsProps = {
  item: IWritePantryItemPortionDto;
  index: number;
};
function SelectedPantryItemDetails(props: SelectedPantryItemDetailsProps) {
  const { item, index } = props;
  const {
    data: pantryItem,
    isSuccess,
    isError,
    isLoading,
  } = useGetPantryItemQuery(String(item.pantryItemId), {
    skip: !item.pantryItemId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading pantry item</div>;
  if (!isSuccess) return <div>No pantry item found</div>;
  return (
    <li key={index} className="bp-ingredient_list_item__products__list__item">
      <div>{index + 1}.</div>
      <div className="bp-ingredient_list_item__products__list__item__details">
        <div className="bp-ingredient_list_item__products__list__item__details__name">{pantryItem?.product?.name ?? "N/A"}</div>
        <div className="bp-ingredient_list_item__products__list__item__details__date_info"> (expires in {dayjs(pantryItem?.expiryDate).diff(dayjs(), "days")} days)</div>
      </div>
      <div>
        {item.portion.magnitude} {item.portion.unit}
      </div>
    </li>
  );
}

function PortionFulfilledMeter(props: PortionFulfilledMeterProps) {
  const { ingredientId } = props;

  const {
    data: ingredient,
    isError,
    isLoading,
    isSuccess,
  } = useGetRecipeIngredientQuery(ingredientId, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    skip: !ingredientId,
  });
  const { getPortionFulfilledStatus } = useMealPlanFormActions();

  if (isLoading) return <div className="bp-portion_fulfilled_meter">Loading...</div>;

  if (isError) return <div className="bp-portion_fulfilled_meter">Error loading ingredient</div>;

  if (!isSuccess || !ingredient) return <div className="bp-portion_fulfilled_meter">No ingredient found</div>;

  const status = getPortionFulfilledStatus(ingredient);

  if (!status) return <div className="bp-portion_fulfilled_meter">No status found</div>;

  const { isFulfilled, remainingPortion, requiredPortion, selectedPortion, isOverfulfilled } = status;
  console.log("Portion fulfilled status", status);

  const percentage = Math.min((selectedPortion.magnitude / requiredPortion.magnitude) * 100, 100);
  return (
    <div className="bp-portion_fulfilled_meter">
      {!isFulfilled && (
        <div>
          {remainingPortion.magnitude} {remainingPortion.unit} remaining
        </div>
      )}
      <ProgressBar now={percentage} />
      {!isFulfilled ? (
        <Pill className="bp-portion_fulfilled_meter__pill" status="error">
          <FaExclamationTriangle />
          &nbsp; Insufficient portion selected
        </Pill>
      ) : isOverfulfilled ? (
        <Pill status="warning" className="bp-portion_fulfilled_meter__pill">
          <FaExclamationTriangle />
          &nbsp;Excessive portion selected
        </Pill>
      ) : (
        <Pill status="success" className="bp-portion_fulfilled_meter__pill">
          <FaCheckCircle />
          &nbsp; Sufficient portion selected
        </Pill>
      )}
    </div>
  );
}
