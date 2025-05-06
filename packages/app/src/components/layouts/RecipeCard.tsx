import "../styles/RecipeCard.scss";

import { ArrowContainer, Popover } from "react-tiny-popover";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IRecipe, SegmentedTime } from "@biaplanner/shared";
import { MdAccessTime, MdAccessTimeFilled } from "react-icons/md";
import { PiChefHatFill, PiQuestionFill } from "react-icons/pi";
import { TbAlertTriangle, TbBowlSpoonFilled } from "react-icons/tb";
import { useCallback, useState } from "react";

import Card from "react-bootstrap/Card";
import { SiLevelsdotfyi } from "react-icons/si";
import convertToSentenceCase from "@/util/convertToSentenceCase";
import { getImagePath } from "@/util/imageFunctions";

export type RecipeCardProps = {
  recipe: IRecipe;
  onClick?: (recipe: IRecipe) => void;
};

export function formatSegmentedTimeAsString(time: SegmentedTime) {
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
  const formattedTime = timeParts.join(" ");
  if (formattedTime.trim().length === 0) {
    return undefined;
  }
}

export default function RecipeCard(props: RecipeCardProps) {
  const { recipe, onClick } = props;

  const handleRecipeClick = useCallback(() => {
    onClick?.(recipe);
  }, [onClick, recipe]);

  return (
    <Card className="bp-recipe_card" onClick={handleRecipeClick}>
      <Card.Img
        className="bp-recipe_card__img"
        variant="top"
        src={getImagePath(recipe.coverImage)}
        alt={`
        Image of 
        ${recipe.title}`}
      />

      <Card.ImgOverlay className="bp-recipe_card__img_overlay">
        <FavouriteButton isFavourite={false} onClick={() => {}} />
        <AllergenCautionLabel recipe={recipe} />
      </Card.ImgOverlay>

      <Card.Header className="bp-recipe_card__header">
        <Card.Title className="bp-recipe_card__header__title">{recipe.title}</Card.Title>
      </Card.Header>
      <Card.Body className="bp-recipe_card__body">
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
                Preparation time
              </dt>
              <dd className="bp-recipe_card__body__dl__dd">{formatSegmentedTimeAsString(recipe.prepTime)}</dd>
            </div>
          )}
          {recipe.cookingTime && (
            <div className="bp-recipe_card__body__dl__pair">
              <dt className="bp-recipe_card__body__dl__dt">
                {" "}
                <MdAccessTimeFilled className="bp-recipe_card__body__dl__dt__icon" />
                Cooking time
              </dt>
              <dd className="bp-recipe_card__body__dl__dd">{formatSegmentedTimeAsString(recipe.cookingTime)}</dd>
            </div>
          )}
          {recipe.cuisine?.name && (
            <div className="bp-recipe_card__body__dl__pair">
              <dt className="bp-recipe_card__body__dl__dt">
                <PiChefHatFill className="bp-recipe_card__body__dl__dt__icon" />
                Cuisine
              </dt>
              <dd className="bp-recipe_card__body__dl__dd">{recipe.cuisine?.name ?? "N/A"}</dd>
            </div>
          )}
          {recipe.difficultyLevel && (
            <div className="bp-recipe_card__body__dl__pair">
              <dt className="bp-recipe_card__body__dl__dt">
                <SiLevelsdotfyi className="bp-recipe_card__body__dl__dt__icon" />
                Difficulty
              </dt>
              <dd className="bp-recipe_card__body__dl__dd">{convertToSentenceCase(recipe.difficultyLevel)}</dd>
            </div>
          )}
        </dl>
        {recipe.tags && recipe.tags.length > 0 && (
          <>
            <hr />
            <div className="bp-recipe_card__body__tags">
              {recipe.tags.map((tag) => (
                <div key={tag.id} className="bp-recipe_card__body__tag">
                  {tag.name}
                </div>
              ))}
            </div>
          </>
        )}
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

export type AllergenCautionLabelProps = {
  recipe: IRecipe;
};
function AllergenCautionLabel(props: AllergenCautionLabelProps) {
  const { recipe } = props;
  const allergens = recipe.ingredients
    .flatMap((ingredient) => ingredient.productCategories)
    .filter((category) => category.isAllergen)
    .map((category) => category.name);
  const uniqueAllergens = Array.from(new Set(allergens));
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  if (uniqueAllergens.length === 0) {
    return null;
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer position={position} childRect={childRect} popoverRect={popoverRect} arrowColor="#ffc107" arrowSize={12} className="bp-recipe_card__popover__arrow_container">
          <div className="bp-recipe_card__allergen_popover">
            <div className="bp-recipe_card__allergen_popover__text">Allergens present: {uniqueAllergens.join(", ")}</div>
          </div>
        </ArrowContainer>
      )}
      positions={["bottom", "top", "right", "left"]} // preferred position by priority
      padding={10}
    >
      <div className="bp-recipe_card__allergen_caution_label">
        <TbAlertTriangle className="bp-recipe_card__allergen_caution_label__icon" />

        <span className="bp-recipe_card__allergen_caution_label__text">Has allergens</span>
        <PiQuestionFill className="bp-recipe_card__allergen_caution_label__info_icon" onMouseOver={() => setIsPopoverOpen(true)} onMouseLeave={() => setIsPopoverOpen(false)} />
      </div>
    </Popover>
  );
}
