import "../styles/ProductGrid.scss";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { IQueryProductResultsDto } from "@biaplanner/shared";
import ProductCard from "./ProductCard";
import Row from "react-bootstrap/Row";
import { useMemo } from "react";

export type ProductGridProps = {
  products: IQueryProductResultsDto[];
  onClick?: (product: IQueryProductResultsDto) => void;
};

export default function ProductGrid(props: ProductGridProps) {
  const { products, onClick } = props;

  const productCards = useMemo(() => {
    return products.map((product) => (
      <Col xs={12} sm={6} lg={4} xxl={3} key={product.productId} className="bp-product_grid__col">
        <ProductCard product={product} onClick={onClick} />
      </Col>
    ));
  }, [onClick, products]);

  return (
    <div className="d-flex justify-content-center">
      <Container fluid className="bp-product_grid">
        <Row className="bp-product_grid__row">{productCards}</Row>
      </Container>
    </div>
  );
}
