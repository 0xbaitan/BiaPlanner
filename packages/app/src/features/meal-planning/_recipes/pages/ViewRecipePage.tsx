import "../styles/ViewRecipePage.scss";

import { FaPencil, FaTrash } from "react-icons/fa6";
import { MdAccessTime, MdAccessTimeFilled } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "react-bootstrap";
import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import { FaInfoCircle } from "react-icons/fa";
import Heading from "@/components/Heading";
import { IconType } from "react-icons";
import { PiChefHatFill } from "react-icons/pi";
import { SegmentedTime } from "@biaplanner/shared";
import { SiLevelsdotfyi } from "react-icons/si";
import { TbBowlSpoonFilled } from "react-icons/tb";
import Tooltip from "@/components/Tooltip";
import convertToSentenceCase from "@/util/convertToSentenceCase";
import { formatSegmentedTimeAsString } from "@/components/layouts/RecipeCard";
import { useGetRecipeQuery } from "@/apis/RecipeApi";

export default function ViewRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: recipe,
    isLoading,
    isError,
  } = useGetRecipeQuery(String(id), {
    refetchOnMountOrArgChange: true,
  });

  const metaItems = [
    {
      label: recipe?.cuisine.name,
      icon: PiChefHatFill,
      description: "Cuisine",
    },
    {
      label: recipe?.difficultyLevel?.toString(),
      icon: SiLevelsdotfyi,
      description: "Difficulty",
    },
    {
      label: recipe?.prepTime ? `${formatSegmentedTimeAsString(recipe.prepTime)}` : undefined,
      icon: MdAccessTime,
      description: "Prepping time",
    },
    {
      label: recipe?.cookingTime ? `${formatSegmentedTimeAsString(recipe.cookingTime)}` : undefined,
      icon: MdAccessTimeFilled,
      description: "Cooking time",
    },
    {
      label: recipe?.defaultNumberOfServings ? `${recipe.defaultNumberOfServings[0]} - ${recipe.defaultNumberOfServings[1]} servings` : undefined,
      icon: TbBowlSpoonFilled,
      description: "Servings",
    },
  ]
    .filter((item) => item.label !== undefined)
    .map((item) => ({
      label: convertToSentenceCase(item.label! as string),
      icon: item.icon,
      description: item.description,
    }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <CrudViewPageLayout
      breadcrumbs={[
        {
          label: "Recipes",
          href: "/meal-planning/recipes",
        },
        {
          label: `${recipe.title}`,
          href: `/meal-planning/recipes/view/${recipe.id}`,
        },
      ]}
      title={recipe.title}
      actions={
        <div className="bp-recipe_view__actions">
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/meal-planning/recipes/update/${recipe.id}`);
            }}
          >
            <FaPencil />
            &ensp;Edit recipe
          </Button>

          <Button
            variant="outline-danger"
            onClick={() => {
              // Handle delete action
            }}
          >
            <FaTrash />
            &ensp;Delete recipe
          </Button>
        </div>
      }
    >
      <div className="bp-recipe_view__content">
        <div className="bp-recipe_view__details_container">
          <div className="bp-recipe_view__image_container"></div>
          <div className="bp-recipe_view__info_container">
            <div className="bp-recipe_view__info__meta">
              {metaItems.map((item, index) => {
                const Icon: IconType = item.icon;
                return (
                  <div key={index} className="bp-recipe_view__info__meta__item">
                    <Icon className="bp-recipe_view__info__meta__item__icon" />
                    <div>
                      <div className="bp-recipe_view__info__meta__item__label">{item.label}</div>
                      <div className="bp-recipe_view__info__meta__item__description">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bp-recipe_view__info__description__container">
              <Heading level={Heading.Level.H2}>About the recipe</Heading>
              <p className="bp-recipe_view__info_description">{recipe.description}</p>
            </div>
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="bp-recipe_view__info__tags__container">
                <Heading level={Heading.Level.H3}>Tags</Heading>
                <div className="bp-recipe_view__info__tags">
                  {recipe.tags?.map((tag) => (
                    <div key={tag.id} className="bp-recipe_view__info__tags__item">
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <hr className="bp-recipe_view__divider" />
        <div className="bp-recipe_view__ingredients_directions__container">
          <div className="bp-recipe_view__ingredients_directions__container__ingredients">
            <Heading level={Heading.Level.H2}>Ingredients</Heading>
            <ol className="bp-recipe_view__ingredients_directions__container__ingredients__list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={ingredient.id} className="bp-recipe_view__ingredients_directions__container__ingredients__list__item">
                  <div>{index + 1}.</div>{" "}
                  <div>
                    {ingredient.measurement?.magnitude && ingredient.measurement?.unit ? `${ingredient.measurement.magnitude} ${ingredient.measurement.unit} of ` : ""}

                    {ingredient.title}
                  </div>
                  <Tooltip className="bp-recipe_view__product_categories_info_tooltip" icon={FaInfoCircle} placement={["top", "bottom", "left", "right"]}>
                    <div className="bp-recipe_product_categories_info_tooltip__content">
                      <div className="bp-recipe_view__product_categories_info_tooltip__content__title">Applicable product categories:</div>
                      <div className="bp-recipe_view__product_categories_info_tooltip__content__items">
                        {ingredient.productCategories.map((productCategory) => (
                          <div key={productCategory.id} className="bp-recipe_view__product_categories__item">
                            {productCategory.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tooltip>
                </li>
              ))}
            </ol>
          </div>
          <div className="bp-recipe_view__ingredients_directions__container__directions">
            <Heading level={Heading.Level.H2}>Directions</Heading>
          </div>
        </div>
      </div>
    </CrudViewPageLayout>
  );
}
