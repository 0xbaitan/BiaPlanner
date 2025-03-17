import "../styles/RecipeCard.scss";

import Card from "react-bootstrap/Card";
import { IRecipe } from "@biaplanner/shared";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type RecipeCardProps = {
  recipe: IRecipe;
};

export default function RecipeCard(props: RecipeCardProps) {
  const { recipe } = props;
  const navigate = useNavigate();
  const handleRecipeClick = useCallback(() => {
    navigate({
      pathname: "/meal-planning/meal-plans/create",
      search: `?recipeId=${recipe.id}`,
    });
  }, [navigate, recipe.id]);

  return (
    <Card className="bp-recipe_card" onClick={handleRecipeClick}>
      <Card.Img className="bp-recipe_card__img" variant="top" src={"https://picsum.photos/200/300"} />
      <Card.Header className="bp-recipe_card__header">
        <Card.Title className="bp-recipe_card__header__title">{recipe.title}</Card.Title>
      </Card.Header>
      <Card.Body className="bp-recipe_card__body">
        <Card.Text>{recipe.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
