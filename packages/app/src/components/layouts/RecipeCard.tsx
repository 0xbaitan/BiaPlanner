import "../styles/RecipeCard.scss";

import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IRecipe, SegmentedTime } from "@biaplanner/shared";
import { MdAccessTime, MdAccessTimeFilled } from "react-icons/md";
import { useCallback, useState } from "react";

import Card from "react-bootstrap/Card";
import { PiChefHatFill } from "react-icons/pi";
import { TbBowlSpoonFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export type RecipeCardProps = {
  recipe: IRecipe;
};

function formatSegmentedTimeAsString(time: SegmentedTime) {
  const { days, hours, minutes, seconds } = time;
  const timeParts: string[] = [];
  if (days > 0) {
    timeParts.push(`${days}d`);
  }
  if (hours > 0) {
    timeParts.push(`${hours}h`);
  }
  if (minutes > 0) {
    timeParts.push(`${minutes}m`);
  }
  if (seconds > 0) {
    timeParts.push(`${seconds}s`);
  }
  return timeParts.join(" ");
}

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
        <FavouriteButton isFavourite={false} onClick={() => {}} />
      </Card.ImgOverlay>

      <Card.Header className="bp-recipe_card__header">
        <Card.Title className="bp-recipe_card__header__title">{recipe.title}</Card.Title>
      </Card.Header>
      <Card.Body className="bp-recipe_card__body">
        <Card.Text>
          <dl className="bp-recipe_card__body__dl">
            {recipe.defaultNumberOfServings && (
              <div className="bp-recipe_card__body__dl__pair">
                <dt className="bp-recipe_card__body__dl__dt">
                  <TbBowlSpoonFilled className="bp-recipe_card__body__dl__dt__icon" />
                  Servings
                </dt>
                <dd className="bp-recipe_card__body__dl__dd">{recipe.defaultNumberOfServings[0] - recipe.defaultNumberOfServings[1]}</dd>
              </div>
            )}
            {recipe.prepTime && (
              <div className="bp-recipe_card__body__dl__pair">
                <dt className="bp-recipe_card__body__dl__dt">
                  <MdAccessTime className="bp-recipe_card__body__dl__dt__icon" />
                  Preparation Time
                </dt>
                <dd className="bp-recipe_card__body__dl__dd">{formatSegmentedTimeAsString(recipe.prepTime)}</dd>
              </div>
            )}
            {recipe.cookingTime && (
              <div className="bp-recipe_card__body__dl__pair">
                <dt className="bp-recipe_card__body__dl__dt">
                  {" "}
                  <MdAccessTimeFilled className="bp-recipe_card__body__dl__dt__icon" />
                  Cooking Time
                </dt>
                <dd className="bp-recipe_card__body__dl__dd">{formatSegmentedTimeAsString(recipe.cookingTime)}</dd>
              </div>
            )}
            {recipe.cuisine.name && (
              <div className="bp-recipe_card__body__dl__pair">
                <dt className="bp-recipe_card__body__dl__dt">
                  <PiChefHatFill className="bp-recipe_card__body__dl__dt__icon" />
                  Cuisine
                </dt>
                <dd className="bp-recipe_card__body__dl__dd">{recipe.cuisine.name}</dd>
              </div>
            )}
          </dl>
        </Card.Text>
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
