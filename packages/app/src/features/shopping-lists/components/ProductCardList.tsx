import "../styles/ProductItemCardList.scss";

import AddExtraVariantProductCard from "./AddExtraVariantProductCard";
import { BrowseProductsType } from "./BrowseProductsOffcanvas";
import { IProduct } from "@biaplanner/shared";
import NormalVariantProductCard from "./NormalVariantProductCard";
import ReplacementVariantProductCard from "./ReplacementVariantProductCard";

export type ProductCardProps = {
  product: IProduct;
  hideAddedBadge?: boolean;
};

export type ProductCardListProps = {
  products: IProduct[];
  hideAddedBadge?: boolean;

  type: BrowseProductsType;
};

export default function ProductCardList(props: ProductCardListProps) {
  const { products, hideAddedBadge, type } = props;

  return (
    <ul className="bp-product_item_card_list">
      {products.map((product) => (
        <li key={product.id}>
          {type === "add-extra" && <AddExtraVariantProductCard product={product} hideAddedBadge={hideAddedBadge} />}
          {type === "normal" && <NormalVariantProductCard product={product} hideAddedBadge={hideAddedBadge} />}
          {type === "replacement" && <ReplacementVariantProductCard product={product} hideAddedBadge={hideAddedBadge} />}
        </li>
      ))}
    </ul>
  );
}
