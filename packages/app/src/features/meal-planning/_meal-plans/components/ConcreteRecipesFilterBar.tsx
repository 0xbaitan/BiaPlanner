import { ConcreteRecipeSortBy, MealTypes } from "@biaplanner/shared";
import { useConcreteRecipesCrudListActions, useConcreteRecipesCrudListState } from "../../reducers/ConcreteRecipesCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useMemo } from "react";

export default function ConcreteRecipesFilterBar() {
  const { resetFilters } = useConcreteRecipesCrudListActions();

  return (
    <FilterBar
      prominentFiltersGroup={
        <FilterBar.Group type="prominent-filters">
          <MealTypeProminentMultiselect />
        </FilterBar.Group>
      }
      sorterGroup={
        <FilterBar.Group type="sorter">
          <ConcreteRecipeSorter />
        </FilterBar.Group>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}

function ConcreteRecipeSorter() {
  const {
    concreteRecipesQuery: { sortBy },
  } = useConcreteRecipesCrudListState();
  const { setSortBy } = useConcreteRecipesCrudListActions();

  return (
    <FilterBar.Sorter
      value={sortBy}
      onChange={(e) => {
        const value = (e.target as HTMLSelectElement).value;
        setSortBy(value as ConcreteRecipeSortBy);
      }}
    >
      <option value={ConcreteRecipeSortBy.NEWEST}>Newest</option>
      <option value={ConcreteRecipeSortBy.OLDEST}>Oldest</option>
      <option value={ConcreteRecipeSortBy.RECIPE_TITLE_A_TO_Z}>Recipe title (A to Z)</option>
      <option value={ConcreteRecipeSortBy.RECIPE_TITLE_Z_TO_A}>Recipe title (Z to A)</option>
      <option value={ConcreteRecipeSortBy.MOST_UREGENT}>Most urgent</option>
      <option value={ConcreteRecipeSortBy.LEAST_URGENT}>Least urgent</option>
    </FilterBar.Sorter>
  );
}

function MealTypeProminentMultiselect() {
  const options = useMemo(() => {
    return Object.entries(MealTypes).map(([key, value]) => ({
      label: normaliseEnumKey(key),
      value,
    }));
  }, []);

  const { setFilter } = useConcreteRecipesCrudListActions();
  const {
    concreteRecipesQuery: { mealType },
  } = useConcreteRecipesCrudListState();

  const mappedOptions = useMemo(() => {
    return (mealType ?? [])
      ?.map((type) => {
        const option = options.find((option) => option.value === type);
        return option ? { label: option.label, value: type } : null;
      })
      .filter(Boolean) as { label: string; value: MealTypes }[];
  }, [mealType, options]);

  return (
    <FilterBar.FilterSelect
      selectLabel="Meal Type"
      list={options}
      selectedValues={mappedOptions}
      onChange={(selectedList) => {
        setFilter({ mealType: selectedList.map((item) => item.value) as MealTypes[] });
      }}
      idSelector={(item) => item.value}
      nameSelector={(item) => item.label}
    />
  );
}
