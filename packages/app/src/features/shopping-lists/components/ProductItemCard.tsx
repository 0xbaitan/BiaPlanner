import "../styles/ProductItemCard.scss";

import { FaCheckCircle, FaMinus, FaPlus } from "react-icons/fa";
import { FaTrashCan, FaXmark } from "react-icons/fa6";
import { IFile, IProduct } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import { DeepPartial } from "react-hook-form";
import Pill from "@/components/Pill";
import { getImagePath } from "@/util/imageFunctions";
import { useShoppingListItemsActions } from "../reducers/ShoppingListItemsReducer";

export type ProductItemCardProps = {
  product: IProduct;
  hideAddedBadge?: boolean;
};

export default function ProductItemCard(props: ProductItemCardProps) {
  const { product, hideAddedBadge } = props;
  const imagePath = getImagePath(product.cover as IFile);
  const { addShoppingListItem, getItem, removeShoppingListItem, isItemPresent } = useShoppingListItemsActions();
  const isPresentInList = isItemPresent(product.id);
  const item = getItem(product.id);
  return (
    <div className="bp-product_item_card">
      <div className="bp-product_item_card__main">
        <div className="bp-product_item_card__product_info">
          <img className="bp-product_item_card__img" src={imagePath} alt={product.name} />
          <div className="bp-product_item_card__product_info__details">
            <div className="bp-product_item_card__product_name">
              {product.name} {isPresentInList && !hideAddedBadge && <span className="bp-product_item_card__added_badge">Already added</span>}
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
          {!isPresentInList && (
            <Button
              variant="outline-primary"
              onClick={() =>
                addShoppingListItem({
                  productId: product.id,
                  quantity: 1,
                  product,
                })
              }
            >
              Add to list
            </Button>
          )}

          {isPresentInList && (
            <div className="bp-product_item_card__quantity_actions">
              <Button
                variant="outline-primary"
                className="bp-product_item_card__action_button"
                size="sm"
                onClick={() => {
                  const newQuantity = item?.quantity ? item.quantity - 1 : 0;
                  if (newQuantity > 0) {
                    addShoppingListItem({ productId: product.id, quantity: newQuantity, product });
                  } else {
                    removeShoppingListItem(product.id);
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
                  addShoppingListItem({ productId: product.id, quantity: newQuantity, product });
                }}
              >
                <FaPlus />
              </Button>
            </div>
          )}
        </div>

        {isPresentInList && (
          <div className="bp-product_item_card__remove_button">
            <Button
              variant="outline-danger"
              className="bp-cancel_button"
              size="sm"
              onClick={() => {
                removeShoppingListItem(product.id);
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
