import { useShoppingListsCrudListActions, useShoppingListsCrudListState } from "../reducers/ShoppingListsCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";
import { ShoppingListSortBy } from "@biaplanner/shared";

export default function ShoppingListsFilterBar() {
  const { resetFilters } = useShoppingListsCrudListActions();

  return (
    <FilterBar
      sorterGroup={
        <FilterBar.Group type="sorter">
          <ShoppingListSorter />
        </FilterBar.Group>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}

function ShoppingListSorter() {
  const {
    shoppingListsQuery: { sortBy },
  } = useShoppingListsCrudListState();
  const { setSortBy } = useShoppingListsCrudListActions();

  return (
    <FilterBar.Sorter
      value={sortBy}
      onChange={(e) => {
        const value = (e.target as HTMLSelectElement).value;
        setSortBy(value as ShoppingListSortBy);
      }}
    >
      <option value={ShoppingListSortBy.NEWEST}>Newest</option>
      <option value={ShoppingListSortBy.OLDEST}>Oldest</option>
      <option value={ShoppingListSortBy.TITLE_A_TO_Z}>Title (A to Z)</option>
      <option value={ShoppingListSortBy.TITLE_Z_TO_A}>Title (Z to A)</option>
      <option value={ShoppingListSortBy.MOST_URGENT}>Most Urgent</option>
      <option value={ShoppingListSortBy.LEAST_URGENT}>Least Urgent</option>
    </FilterBar.Sorter>
  );
}
