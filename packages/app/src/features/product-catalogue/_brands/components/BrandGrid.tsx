import "../styles/BrandGrid.scss";

import BrandCard from "./BrandCard";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { IQueryBrandResultsDto } from "@biaplanner/shared";
import Row from "react-bootstrap/Row";
import { useMemo } from "react";

export type BrandGridProps = {
  brands: IQueryBrandResultsDto[];
  onClick?: (brand: IQueryBrandResultsDto) => void;
};

export default function BrandGrid(props: BrandGridProps) {
  const { brands, onClick } = props;

  const brandCards = useMemo(() => {
    return brands.map((brand) => (
      <Col xs={12} sm={6} lg={4} xxl={3} key={brand.id} className="bp-brand_grid__col">
        <BrandCard brand={brand} onClick={onClick} />
      </Col>
    ));
  }, [onClick, brands]);

  return (
    <div className="d-flex justify-content-center">
      <Container fluid className="bp-brand_grid">
        <Row className="bp-brand_grid__row">{brandCards}</Row>
      </Container>
    </div>
  );
}
