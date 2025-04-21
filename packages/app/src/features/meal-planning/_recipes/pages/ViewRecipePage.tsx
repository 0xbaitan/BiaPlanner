import "../styles/ViewRecipePage.scss";

import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import { useGetRecipeQuery } from "@/apis/RecipeApi";
import { useParams } from "react-router-dom";

export default function ViewRecipePage() {
  const { id } = useParams();

  const {
    data: recipe,
    isLoading,
    isError,
  } = useGetRecipeQuery(String(id), {
    refetchOnMountOrArgChange: true,
  });

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
        <div>
          <button className="btn btn-primary">Edit</button>
          <button className="btn btn-danger">Delete</button>
        </div>
      }
    >
      <div className="bp-recipe_view__content">
        <div className="bp-recipe_view__details_container">
          <div className="bp-recipe_view__image_container"></div>
          <div className="bp-recipe_view__info_container">
            <div className="bp-recipe_view__info__meta">
              <div className="bp-recipe_view__info__meta__item"></div>
            </div>
            <div className="bp-recipe_view__info__description">
              <h3>Description</h3>
              <p>{recipe.description}</p>
            </div>
          </div>
        </div>
      </div>
    </CrudViewPageLayout>
  );
}
