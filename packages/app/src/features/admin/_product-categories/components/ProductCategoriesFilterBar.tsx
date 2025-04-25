import { ProductCategoryAllergenFilter, ProductCategorySortBy } from "@biaplanner/shared";
import { useProductCategoriesCrudListActions, useProductCategoriesCrudListState } from "../reducers/ProductCategoriesCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";

export default function ProductCategoriesFilterBar() {
  const { setSortBy, setFilter, resetFilters } = useProductCategoriesCrudListActions();
  const { productCategoriesQuery } = useProductCategoriesCrudListState();

  return (
    <FilterBar
      prominentFiltersGroup={
        <FilterBar.Group type="prominent-filters">
          <FilterBar.OrdinarySelect
            label="Allergen visibility:"
            value={productCategoriesQuery.allergenVisibility}
            onChange={(e) =>
              setFilter({
                allergenVisibility: e.target.value as ProductCategoryAllergenFilter,
              })
            }
          >
            <option value={ProductCategoryAllergenFilter.SHOW_EVERYTHING}>Show Everything</option>
            <option value={ProductCategoryAllergenFilter.SHOW_ALLERGENS_ONLY}>Show Allergens Only</option>
            <option value={ProductCategoryAllergenFilter.HIDE_ALLERGENS}>Hide Allergens</option>
          </FilterBar.OrdinarySelect>
        </FilterBar.Group>
      }
      sorterGroup={
        <FilterBar.Group type="sorter">
          <FilterBar.Sorter
            value={productCategoriesQuery.sortBy ?? ProductCategorySortBy.DEFAULT}
            onChange={(e) => {
              const value = e.target.value;
              setSortBy(value as ProductCategorySortBy);
            }}
          >
            <option value={ProductCategorySortBy.DEFAULT}>Default</option>
            <option value={ProductCategorySortBy.PRODUCT_CATEGORY_NAME_A_TO_Z}>Name A to Z</option>
            <option value={ProductCategorySortBy.PRODUCT_CATEGORY_NAME_Z_TO_A}>Name Z to A</option>
            <option value={ProductCategorySortBy.PRODUCT_CATEGORY_MOST_PRODUCTS}>Most Products</option>
            <option value={ProductCategorySortBy.PRODUCT_CATEGORY_LEAST_PRODUCTS}>Least Products</option>
          </FilterBar.Sorter>
        </FilterBar.Group>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}
