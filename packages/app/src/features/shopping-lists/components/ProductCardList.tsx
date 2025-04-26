import "../styles/ProductItemCardList.scss";

import { IProduct, IWriteShoppingItemDto, IWriteShoppingItemExtendedDto, IWriteShoppingListDto } from "@biaplanner/shared";
import { useFieldArray, useFormContext } from "react-hook-form";

import AddExtraVariantProductCard from "./AddExtraVariantProductCard";
import { BrowseProductsType } from "./BrowseProductsOffcanvas";
import NormalVariantProductCard from "./NormalVariantProductCard";
import ReplacementVariantProductCard from "./ReplacementVariantProductCard";

export type ShoppingListItemFunctions = {
  addItemToShoppingList: (item: IWriteShoppingItemDto) => void;
  removeItemFromShoppingList: (productId: string) => void;
  updateItemInShoppingList: (item: IWriteShoppingItemDto) => void;
  getItemInShoppingList: (productId: string) => IWriteShoppingItemDto | null;
  isPresentInList: (productId: string) => boolean;
};

export type ProductCardProps = {
  product: IProduct;
  hideAddedBadge?: boolean;
  shoppingListItemFunctions: ShoppingListItemFunctions;
};

export type ProductCardListProps = {
  products: IProduct[];
  hideAddedBadge?: boolean;
  shoppingListItemFunctions: ShoppingListItemFunctions;

  type: BrowseProductsType;
};

export default function ProductCardList(props: ProductCardListProps) {
  const { products, hideAddedBadge, type } = props;

  return (
    <ul className="bp-product_item_card_list">
      {products.map((product) => (
        <li key={product.id}>
          {type === "add-extra" && <AddExtraVariantProductCard {...props} product={product} />}
          {type === "normal" && <NormalVariantProductCard {...props} product={product} />}
          {type === "replacement" && <ReplacementVariantProductCard {...props} product={product} hideAddedBadge={hideAddedBadge} />}
        </li>
      ))}
    </ul>
  );
}
