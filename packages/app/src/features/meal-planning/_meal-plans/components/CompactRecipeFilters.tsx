import { AllergenProminentMultiselect, CuisineProminentMultiselect, DifficultyLevelMultiselect } from "@/features/recipe-management/_recipes/components/RecipesFilterBar";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../reducers/RecipesCrudListReducer";

import Button from "react-bootstrap/Button";
import FilterBar from "@/components/forms/FilterBar";
import RecipeTagsMultiselect from "@/features/recipe-management/_recipes/components/RecipeTagsMultiselect";

export default function CompactRecipeFilters() {
  const { resetFilters } = useRecipesCrudListActions();

  return (
    <div className="bp-compact_recipe_filters">
      <FilterBar.Group type="hidden-filters">
        <div className="bp-compact_recipe_filters__checkbox_filters">
          <FilterBar.Checkbox label="Own recipes" />
          <FilterBar.Checkbox label="My favourites" />
          <FilterBar.Checkbox label="Use what I have" />
        </div>
        <div className="bp-compact_recipe_filters__multiselect_filters">
          <CuisineProminentMultiselect />
          <AllergenProminentMultiselect />
          <DifficultyLevelMultiselect />
          <RecipeTagsMultiselect />
        </div>
      </FilterBar.Group>
      <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
}
