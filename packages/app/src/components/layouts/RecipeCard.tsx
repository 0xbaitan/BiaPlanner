import "../styles/RecipeCard.scss";

import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useCallback, useState } from "react";

import Card from "react-bootstrap/Card";
import { IRecipe } from "@biaplanner/shared";
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

      <Card.ImgOverlay className="bp-recipe_card__img_overlay">
        <FavouriteButton isFavourite={true} onClick={() => {}} />
      </Card.ImgOverlay>

      <Card.Header className="bp-recipe_card__header">
        <Card.Title className="bp-recipe_card__header__title">{recipe.title}</Card.Title>
      </Card.Header>
      <Card.Body className="bp-recipe_card__body">
        <Card.Text>{recipe.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

type FavouriteButtonProps = {
  isFavourite: boolean;
  onClick: () => void;
};
function FavouriteButton(props: FavouriteButtonProps) {
  const { isFavourite: isFavouriteInitial, onClick } = props;
  const [isFavourite, setIsFavourite] = useState(isFavouriteInitial ?? false);
  return (
    <button className="bp-recipe_card__favourite_btn" onClick={onClick}>
      {isFavourite ? <BsHeartFill className="bp-recipe_card__favourite_btn__icon" /> : <BsHeart className="bp-recipe_card__favourite_btn__icon" />}
    </button>
  );
}
