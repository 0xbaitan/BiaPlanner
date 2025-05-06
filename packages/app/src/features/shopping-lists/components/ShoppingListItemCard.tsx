import "../styles/ShoppingListItemCard.scss";

import { FaMinus, FaPlus, FaTrashCan } from "react-icons/fa6";
import { IFile, IWriteShoppingItemDto } from "@biaplanner/shared";

import { Button } from "react-bootstrap";
import Pill from "@/components/Pill";
import { ProductCardProps } from "./ProductCardList";
import { getImagePath } from "@/util/imageFunctions";
import { useGetProductByIdQuery } from "@/apis/ProductsApi";
import { useShoppingListItemsActions } from "../reducers/ShoppingListItemsReducer";

export type ShoppingListItemCardProps = {
  onUpdate: (value: IWriteShoppingItemDto) => void;
  onRemove: () => void;
  value: IWriteShoppingItemDto;
};

export default function ShoppingListItemCard(props: ShoppingListItemCardProps) {
  const { onUpdate, onRemove, value } = props;
  const { productId, quantity } = value;

  const {
    data: product,
    isError,
    isLoading,
  } = useGetProductByIdQuery(productId, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading product</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const imagePath = getImagePath(product.cover);

  return (
    <div className="bp-shopping_list_item_card">
      <div className="bp-shopping_list_item_card__main">
        <div className="bp-shopping_list_item_card__product_info">
          <img className="bp-shopping_list_item_card__img" src={imagePath} alt={product.name} />
          <div className="bp-shopping_list_item_card__product_info__details">
            <div className="bp-shopping_list_item_card__product_name">{product.name}</div>
            <div className="bp-shopping_list_item_card__measurement">
              {product?.measurement?.magnitude} {product?.measurement?.unit}
            </div>
            <div className="bp-shopping_list_item_card__product_categories">
              {product.productCategories?.map((category) => (
                <Pill key={category.id} className="bp-shopping_list_item_card__product_category">
                  {category.name}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="bp-shopping_list_item_card__actions">
          <Button
            variant="outline-primary"
            disabled={quantity <= 1}
            onClick={() => {
              onUpdate({
                ...value,
                quantity: quantity - 1,
              });
            }}
          >
            <FaMinus />
          </Button>

          <span>{quantity}</span>

          <Button
            variant="outline-primary"
            onClick={() => {
              onUpdate({
                ...value,
                quantity: quantity + 1,
              });
            }}
          >
            <FaPlus />
          </Button>

          <Button variant="outline-danger" onClick={onRemove}>
            <FaTrashCan />
          </Button>
        </div>
      </div>
    </div>
  );
}
