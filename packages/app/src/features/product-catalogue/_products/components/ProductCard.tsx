import "../styles/ProductCard.scss";

import Card from "react-bootstrap/Card";
import { IQueryProductResultsDto } from "@biaplanner/shared";
import { useCallback } from "react";

export type ProductCardProps = {
  product: IQueryProductResultsDto;
  onClick?: (product: IQueryProductResultsDto) => void;
};

export default function ProductCard(props: ProductCardProps) {
  const { product, onClick } = props;

  const handleProductClick = useCallback(() => {
    onClick?.(product);
  }, [onClick, product]);

  return (
    <Card className="bp-product_card" onClick={handleProductClick}>
      <Card.Img className="bp-product_card__img" variant="top" src={product.coverImagePath ? `/images/${product.coverImagePath}` : "/images/default-product.png"} alt={`Image of ${product.productName}`} />
      <Card.Body className="bp-product_card__body">
        <Card.Title className="bp-product_card__title">{product.productName}</Card.Title>
        <Card.Text className="bp-product_card__description">{product.description || "No description available"}</Card.Text>
        <Card.Text className="bp-product_card__brand">Brand: {product.brandName || "N/A"}</Card.Text>
      </Card.Body>
    </Card>
  );
}
