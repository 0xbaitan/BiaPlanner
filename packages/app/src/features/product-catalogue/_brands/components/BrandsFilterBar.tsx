import { useBrandsCrudListActions, useBrandsCrudListState } from "../reducers/BrandsCrudListReducer";

import { BrandSortBy } from "@biaplanner/shared";
import FilterBar from "@/components/forms/FilterBar";

export default function BrandsFilterBar() {
  const { setSortBy, resetFilters } = useBrandsCrudListActions();
  const { brandsQuery } = useBrandsCrudListState();

  return (
    <FilterBar
      sorterGroup={
        <FilterBar.Sorter
          value={brandsQuery.sortBy ?? BrandSortBy.DEFAULT}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(value as BrandSortBy);
          }}
        >
          <option value={BrandSortBy.DEFAULT}>Default</option>
          <option value={BrandSortBy.BRAND_NAME_A_TO_Z}>Brand Name A to Z</option>
          <option value={BrandSortBy.BRAND_NAME_Z_TO_A}>Brand Name Z to A</option>
          <option value={BrandSortBy.BRAND_MOST_PRODUCTS}>Most Products</option>
          <option value={BrandSortBy.BRAND_LEAST_PRODUCTS}>Least Products</option>
        </FilterBar.Sorter>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}
