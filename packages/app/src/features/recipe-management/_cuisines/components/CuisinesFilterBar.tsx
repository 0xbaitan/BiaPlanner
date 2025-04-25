import { useCuisinesCrudListActions, useCuisinesCrudListState } from "../reducers/CuisinesCrudListReducer";

import { CuisineSortBy } from "@biaplanner/shared";
import FilterBar from "@/components/forms/FilterBar";

export default function CuisinesFilterBar() {
  const { setSortBy } = useCuisinesCrudListActions();
  const { cuisinesQuery } = useCuisinesCrudListState();

  return (
    <FilterBar
      sorterGroup={
        <FilterBar.Group type="sorter">
          <FilterBar.Sorter
            value={cuisinesQuery.sortBy ?? CuisineSortBy.DEFAULT}
            onChange={(e) => {
              const value = e.target.value;
              setSortBy(value as CuisineSortBy);
            }}
          >
            <option value={CuisineSortBy.DEFAULT}>Default</option>
            <option value={CuisineSortBy.CUISINE_NAME_A_TO_Z}>Cuisine Name A to Z</option>
            <option value={CuisineSortBy.CUISINE_NAME_Z_TO_A}>Cuisine Name Z to A</option>
            <option value={CuisineSortBy.CUISINE_MOST_RECIPES}>Cuisine Most Recipes</option>
            <option value={CuisineSortBy.CUISINE_LEAST_RECIPES}>Cuisine Least Recipes</option>
          </FilterBar.Sorter>
        </FilterBar.Group>
      }
    />
  );
}
