import { useRecipeTagsCrudListActions, useRecipeTagsCrudListState } from "../reducers/RecipeTagsCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";
import { RecipeTagSortBy } from "@biaplanner/shared";

export default function RecipeTagsFilterBar() {
  const { setSortBy } = useRecipeTagsCrudListActions();
  const { recipeTagsQuery } = useRecipeTagsCrudListState();
  return (
    <FilterBar>
      <FilterBar.Group type="sorter">
        <FilterBar.Sorter
          value={recipeTagsQuery.sortBy ?? RecipeTagSortBy.DEFAULT}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(value as RecipeTagSortBy);
          }}
        >
          <option value={RecipeTagSortBy.DEFAULT}>Default</option>
          <option value={RecipeTagSortBy.RECIPE_TAG_NAME_A_TO_Z}>Recipe Tag Name A to Z</option>
          <option value={RecipeTagSortBy.RECIPE_TAG_NAME_Z_TO_A}>Recipe Tag Name Z to A</option>
          <option value={RecipeTagSortBy.RECIPE_TAG_MOST_RECIPES}>Recipe Tag Most Recipes</option>
          <option value={RecipeTagSortBy.RECIPE_TAG_LEAST_RECIPES}>Recipe Tag Least Recipes</option>
        </FilterBar.Sorter>
      </FilterBar.Group>
    </FilterBar>
  );
}
