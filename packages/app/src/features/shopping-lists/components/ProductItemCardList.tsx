import "../styles/ProductItemCardList.scss";

import { DeepPartial } from "utility-types";
import { IProduct } from "@biaplanner/shared";
import ProductItemCard from "./ProductItemCard";

export type ProductItemCardListProps = {
  products: IProduct[];
};

export default function ProductItemCardList(props: ProductItemCardListProps) {
  const { products } = props;

  return (
    <ul className="bp-product_item_card_list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductItemCard product={product} />
        </li>
      ))}
    </ul>
  );
}
