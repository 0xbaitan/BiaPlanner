import "../styles/RecipeGrid.scss";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { IRecipe } from "@biaplanner/shared";
import RecipeCard from "./RecipeCard";
import Row from "react-bootstrap/Row";
import { useMemo } from "react";

export type RecipeGridProps = {
  recipes: IRecipe[];
  onClick?: (recipe: IRecipe) => void;
};

export default function RecipeGrid(props: RecipeGridProps) {
  const { recipes, onClick } = props;

  const recipeCards = useMemo(() => {
    return recipes.map((recipe) => (
      <Col xs={12} sm={6} lg={4} xxl={3} key={recipe.id} className="bp-recipe_grid__col">
        <RecipeCard recipe={recipe} onClick={onClick} />
      </Col>
    ));
  }, [onClick, recipes]);

  return (
    <div className="d-flex justify-content-center">
      <Container fluid className="bp-recipe_grid">
        <Row className="bp-recipe_grid__row">{recipeCards}</Row>
      </Container>
    </div>
  );
}
