import "../styles/ProductCard.scss";

import Card from "react-bootstrap/Card";
import { IProduct } from "@biaplanner/shared";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";

export type ProductCardProps = {
  product: IProduct;
  onClick?: (product: IProduct) => void;
};

export default function ProductCard(props: ProductCardProps) {
  const { product, onClick } = props;

  const handleProductClick = useCallback(() => {
    onClick?.(product);
  }, [onClick, product]);

  return (
    <Card className="bp-product_card" onClick={handleProductClick}>
      <Card.Img className="bp-product_card__img" variant="top" src={getImagePath(product.cover)} />
      <Card.Body className="bp-product_card__body">
        <Card.Title className="bp-product_card__title">{product.name}</Card.Title>
        <Card.Text className="bp-product_card__description">{product.description || "No description available"}</Card.Text>
        <Card.Text className="bp-product_card__brand">Brand: {product.brand?.name || "N/A"}</Card.Text>
      </Card.Body>
    </Card>
  );
}
