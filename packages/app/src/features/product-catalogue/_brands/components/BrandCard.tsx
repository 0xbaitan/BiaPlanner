import "../styles/BrandCard.scss";

import { IFile, IQueryBrandResultsDto } from "@biaplanner/shared";

import Card from "react-bootstrap/Card";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";

export type BrandCardProps = {
  brand: IQueryBrandResultsDto;
  onClick?: (brand: IQueryBrandResultsDto) => void;
};

export default function BrandCard(props: BrandCardProps) {
  const { brand, onClick } = props;

  const handleBrandClick = useCallback(() => {
    onClick?.(brand);
  }, [onClick, brand]);

  return (
    <Card className="bp-brand_card" onClick={handleBrandClick}>
      <Card.Img className="bp-brand_card__img" variant="top" src={getImagePath(brand.imageFileMetadata as IFile)} alt={`Logo of ${brand.name}`} />
      <Card.Body className="bp-brand_card__body">
        <Card.Title className="bp-brand_card__title">{brand.name}</Card.Title>
        <Card.Text className="bp-brand_card__description">{brand.description || "No description available"}</Card.Text>
        <Card.Text className="bp-brand_card__product_count">Products: {brand.productCount ?? 0}</Card.Text>
      </Card.Body>
    </Card>
  );
}
