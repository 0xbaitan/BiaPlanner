import "../styles/ProductItemCard.scss";

import { IFile, IProduct } from "@biaplanner/shared";

import { DeepPartial } from "react-hook-form";
import { getImagePath } from "@/util/imageFunctions";
import { useShoppingListItemsActions } from "../reducers/ShoppingListItemsReducer";

export type ProductItemCardProps = {
  product: IProduct;
};

export default function ProductItemCard(props: ProductItemCardProps) {
  const { product } = props;
  const imagePath = getImagePath(product.cover as IFile);
  const { addShoppingListItem, removeShoppingListItem, isItemPresent } = useShoppingListItemsActions();
  const isPresentInList = isItemPresent(product.id);
  return (
    <div className="bp-product_item_card">
      <img className="bp-product_item_card__img" src={imagePath} alt={product.name} />
      {/* {imagePath && <img className="w-full h-32 object-cover rounded-lg" src={imagePath} alt={product.name} loading="lazy" />} */}
      <div className="bp-product_item_card__product_name">{product.name}</div>
      <div className="bp-product_item_card__measurement">
        {product.measurement.magnitude} {product.measurement.unit}
      </div>
      <div className="text-xs text-gray-500">{product.description}</div>

      <div className="bp-product_item_card__product_categories">
        {product.productCategories?.map((category) => (
          <span key={category.id} className="bp-product_item_card__product_category">
            {category.name}
          </span>
        ))}
      </div>
      {!isPresentInList && (
        <button
          onClick={() =>
            addShoppingListItem({
              productId: product.id,
              quantity: 1,
            })
          }
        >
          Add
        </button>
      )}
      {isPresentInList && <button onClick={() => removeShoppingListItem(product.id)}>Remove</button>}
    </div>
  );
}
