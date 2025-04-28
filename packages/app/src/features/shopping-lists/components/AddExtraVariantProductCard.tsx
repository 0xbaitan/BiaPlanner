import { FaMinus, FaPlus } from "react-icons/fa";
import { MarkShoppingDoneActions, useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import Button from "react-bootstrap/esm/Button";
import { FaTrashCan } from "react-icons/fa6";
import { IFile } from "@biaplanner/shared";
import Pill from "@/components/Pill";
import { ProductCardProps } from "./ProductCardList";
import dayjs from "dayjs";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";

export default function AddExtraVariantProductCard(props: ProductCardProps) {
  const { product, hideAddedBadge } = props;
  const imagePath = getImagePath(product.cover as IFile);
  const { isItemPresent, getItem, addExtraShoppingItem, removeExtraShoppingItem, updateQuantity } = useMarkShoppingDoneActions();
  const { shoppingListId } = useMarkShoppingDoneState();
  const isPresentInList = isItemPresent(product.id);
  const item = getItem(product.id);
  const isExtra = isPresentInList === "extra";

  const addItem = useCallback(
    (quantity: number) => {
      addExtraShoppingItem({
        productId: product.id,
        product,
        quantity,
        expiryDate: product.canExpire ? dayjs().toISOString() : undefined,
        shoppingListId,
      });
    },
    [addExtraShoppingItem, product, shoppingListId]
  );

  return (
    <div className="bp-product_item_card">
      <div className="bp-product_item_card__main">
        <div className="bp-product_item_card__product_info">
          <img className="bp-product_item_card__img" src={imagePath} alt={product.name} />
          <div className="bp-product_item_card__product_info__details">
            <div className="bp-product_item_card__product_name">
              {product.name} {isPresentInList && !hideAddedBadge && <span className={`bp-product_item_card__badge ${isPresentInList === "extra" ? "active" : "passive"}`}>{isPresentInList === "extra" ? "Added as extra" : "Already added"}</span>}
            </div>
            <div className="bp-product_item_card__measurement">
              {product?.measurement.magnitude} {product?.measurement.unit}
            </div>
            <div className="bp-product_item_card__product_categories">
              {product.productCategories?.map((category) => (
                <Pill key={category.id} className="bp-product_item_card__product_category">
                  {category.name}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="bp-product_item_card__actions">
          {!isPresentInList && (
            <Button variant="outline-primary" onClick={() => addItem(1)}>
              Add to list
            </Button>
          )}

          {isPresentInList && isExtra && (
            <div className="bp-product_item_card__quantity_actions">
              <Button
                variant="outline-primary"
                className="bp-product_item_card__action_button"
                size="sm"
                onClick={() => {
                  const newQuantity = item?.quantity ? item.quantity - 1 : 0;
                  if (newQuantity > 0) {
                    updateQuantity(product.id, newQuantity);
                  } else {
                    removeExtraShoppingItem(product.id);
                  }
                }}
              >
                <FaMinus />
              </Button>
              <span className="bp-product_item_card__quantity">{item?.quantity ?? 0}</span>
              <Button
                variant="primary"
                className="bp-product_item_card__action_button"
                size="sm"
                onClick={() => {
                  const newQuantity = item?.quantity ? item.quantity + 1 : 0;
                  updateQuantity(product.id, newQuantity);
                }}
              >
                <FaPlus />
              </Button>
            </div>
          )}
        </div>

        {isPresentInList && isExtra && (
          <div className="bp-product_item_card__remove_button">
            <Button
              variant="outline-danger"
              className="bp-cancel_button"
              size="sm"
              onClick={() => {
                removeExtraShoppingItem(product.id);
              }}
            >
              <FaTrashCan />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
