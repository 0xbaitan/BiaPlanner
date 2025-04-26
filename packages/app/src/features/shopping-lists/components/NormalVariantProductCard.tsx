import "../styles/ProductItemCard.scss";

import { FaMinus, FaPlus } from "react-icons/fa";
import { ShoppingListItemsActions, useShoppingListItemsActions } from "../reducers/ShoppingListItemsReducer";

import Button from "react-bootstrap/esm/Button";
import { FaTrashCan } from "react-icons/fa6";
import { IFile } from "@biaplanner/shared";
import Pill from "@/components/Pill";
import { ProductCardProps } from "./ProductCardList";
import { getImagePath } from "@/util/imageFunctions";

export default function NormalVariantProductCard(props: ProductCardProps) {
  const { product, hideAddedBadge, shoppingListItemFunctions } = props;
  const imagePath = getImagePath(product.cover as IFile);
  const { addItemToShoppingList, getItemInShoppingList, isPresentInList, removeItemFromShoppingList, updateItemInShoppingList } = shoppingListItemFunctions;

  const item = getItemInShoppingList?.(product.id);
  const alreadyAdded = isPresentInList?.(product.id);

  console.log("aleadyAdded", alreadyAdded);

  return (
    <div className="bp-product_item_card">
      <div className="bp-product_item_card__main">
        <div className="bp-product_item_card__product_info">
          <img className="bp-product_item_card__img" src={imagePath} alt={product.name} />
          <div className="bp-product_item_card__product_info__details">
            <div className="bp-product_item_card__product_name">
              {product.name} {alreadyAdded && <span className="bp-product_item_card__badge active">Already added</span>}
            </div>
            <div className="bp-product_item_card__measurement">
              {product.measurement.magnitude} {product.measurement.unit}
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
          {!alreadyAdded && (
            <Button
              variant="outline-primary"
              onClick={() =>
                addItemToShoppingList?.({
                  quantity: 1,
                  productId: product.id,
                })
              }
            >
              Add to list
            </Button>
          )}

          {alreadyAdded && (
            <div className="bp-product_item_card__quantity_actions">
              <Button
                variant="outline-primary"
                className="bp-product_item_card__action_button"
                size="sm"
                onClick={() => {
                  const newQuantity = item?.quantity ? item.quantity - 1 : 0;
                  if (newQuantity > 0) {
                    updateItemInShoppingList?.({ productId: product.id, quantity: newQuantity });
                  } else {
                    removeItemFromShoppingList?.(product.id);
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
                  updateItemInShoppingList?.({ productId: product.id, quantity: newQuantity });
                }}
              >
                <FaPlus />
              </Button>
            </div>
          )}
        </div>

        {alreadyAdded && (
          <div className="bp-product_item_card__remove_button">
            <Button
              variant="outline-danger"
              className="bp-cancel_button"
              size="sm"
              onClick={() => {
                removeItemFromShoppingList?.(product.id);
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
