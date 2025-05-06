import "../styles/RecipeFilterBar.scss";

import { DifficultyLevels, ICuisine, IProductCategory, IRecipeTag, RecipeSortBy } from "@biaplanner/shared";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../../meal-planning/reducers/RecipesCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useGetAllergensQuery } from "@/apis/ProductCategoryApi";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";
import { useMemo } from "react";

export type RecipeFilterBarProps = {};
export default function RecipesFilterBar() {
  const { resetFilters } = useRecipesCrudListActions();

  return (
    <FilterBar
      prominentFiltersGroup={
        <FilterBar.Group type="prominent-filters">
          <CuisineProminentMultiselect />
          <AllergenProminentMultiselect />
        </FilterBar.Group>
      }
      hiddenFiltersGroup={
        <FilterBar.Group type="hidden-filters">
          <div className="bp-recipe_filter_bar__hidden-filters">
            <div className="bp-recipe_filter_bar__checkbox_filters">
              <FilterBar.Checkbox label="Own recipes" />
              <FilterBar.Checkbox label="My favourites" />
              <FilterBar.Checkbox label="Use what I have" />
            </div>
            <div className="bp-recipe_filter_bar__multiselect_filters">
              <DifficultyLevelMultiselect />
              <RecipeTagsMultiselect />
            </div>
          </div>
        </FilterBar.Group>
      }
      sorterGroup={
        <FilterBar.Group type="sorter">
          <RecipeSorter />
        </FilterBar.Group>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}

export function RecipeSorter() {
  const {
    recipesQuery: { sortBy },
  } = useRecipesCrudListState();
  const { setSortBy } = useRecipesCrudListActions();

  return (
    <FilterBar.Sorter
      value={sortBy}
      onChange={(e) => {
        const value = (e.target as HTMLSelectElement).value;
        setSortBy(value as RecipeSortBy);
      }}
    >
      <option value={RecipeSortBy.DEFAULT}>Default</option>
      <option value={RecipeSortBy.RECIPE_TITLE_A_TO_Z}>Recipe title (A to Z)</option>
      <option value={RecipeSortBy.RECIPE_TITLE_Z_TO_A}>Recipe title (Z to A)</option>
      <option value={RecipeSortBy.RECIPE_INCREASING_DIFFICULTY_LEVEL}>Least difficult</option>
      <option value={RecipeSortBy.RECIPE_DECREASING_DIFFICULTY_LEVEL}>Most difficult</option>
      <option value={RecipeSortBy.RECIPE_MOST_TIME_CONSUMING}>Most time consuming</option>
      <option value={RecipeSortBy.RECIPE_LEAST_TIME_CONSUMING}>Least time consuming</option>
      <option value={RecipeSortBy.RECIPE_MOST_RELEVANT_TO_PANTRY}>Most relevant to your pantry</option>
    </FilterBar.Sorter>
  );
}

export function CuisineProminentMultiselect() {
  const { data, isError, isSuccess, isLoading } = useGetCuisinesQuery();
  const {
    recipesQuery: { cuisineIds },
  } = useRecipesCrudListState();
  const { setFilter } = useRecipesCrudListActions();
  const mappedCuisines = useMemo(() => {
    return (cuisineIds ?? [])
      .map((cuisineId) => {
        const found = data?.find((item) => item.id === cuisineId);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
      .filter(Boolean) as ICuisine[];
  }, [cuisineIds, data]);

  if (!data || isError || isLoading) {
    return <div>Failed to fetch cuisines</div>;
  }
  return (
    <FilterBar.FilterSelect
      selectLabel="Cuisines"
      list={isSuccess ? data : []}
      selectedValues={mappedCuisines}
      onChange={(selectedList) => {
        const selectedCuisines = selectedList.map((item) => item.id);
        setFilter({ cuisineIds: selectedCuisines });
      }}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
      loading={isLoading}
      disabled={isLoading || isError || !data?.length}
      noDataLabel="No cuisines available"
    />
  );
}

export function AllergenProminentMultiselect() {
  const { data, isError, isLoading } = useGetAllergensQuery();
  const {
    recipesQuery: { allergenIdsExclude },
  } = useRecipesCrudListState();
  const { setFilter } = useRecipesCrudListActions();
  const mappedAllergens = useMemo(() => {
    return (allergenIdsExclude ?? [])
      .map((allergenId) => {
        const found = data?.find((item) => item.id === allergenId);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
      .filter(Boolean) as IProductCategory[];
  }, [allergenIdsExclude, data]);

  if (!data || isError || isLoading) {
    return <div>Failed to fetch allergens</div>;
  }

  return (
    <FilterBar.FilterSelect
      selectLabel="Allergens excluded"
      selectedValues={mappedAllergens}
      onChange={(selectedList) => {
        const selectedAllergens = selectedList.map((item) => item.id);
        setFilter({ allergenIdsExclude: selectedAllergens });
      }}
      loading={isLoading}
      disabled={isLoading || isError || data?.length === 0}
      list={data ?? []}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
    />
  );
}

export function DifficultyLevelMultiselect() {
  const options = useMemo(() => {
    let entries = Object.entries(DifficultyLevels).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}`, value }));
    return entries;
  }, []);

  const {
    recipesQuery: { difficultyLevel },
  } = useRecipesCrudListState();

  const { setFilter } = useRecipesCrudListActions();

  const mappedDifficultyLevel = useMemo(() => {
    return difficultyLevel
      ?.map((difficultyLevel) => {
        const found = options.find((item) => item.value === difficultyLevel);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
      .filter(Boolean) as { label: string; value: DifficultyLevels }[];
  }, [difficultyLevel, options]);

  return (
    <FilterBar.FilterSelect
      selectLabel="Difficulty level"
      selectedValues={mappedDifficultyLevel}
      onChange={(selectedList) => {
        const selectedDifficultyLevels = selectedList.map((item) => item.value);
        setFilter({ difficultyLevel: selectedDifficultyLevels });
      }}
      idSelector={(item) => item.value}
      nameSelector={(item) => item.label}
      list={options}
    />
  );
}

export function RecipeTagsMultiselect() {
  const { data, isError, isLoading } = useGetRecipeTagsQuery();

  const {
    recipesQuery: { recipeTagIds },
  } = useRecipesCrudListState();
  const { setFilter } = useRecipesCrudListActions();

  const mappedRecipeTags = useMemo(() => {
    return (recipeTagIds ?? [])
      .map((recipeTagId) => {
        const found = data?.find((item) => item.id === recipeTagId);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
      .filter(Boolean) as IRecipeTag[];
  }, [recipeTagIds, data]);

  if (!data || isError || isLoading) {
    return <div>Failed to fetch recipe tags</div>;
  }
  return (
    <FilterBar.FilterSelect
      selectedValues={mappedRecipeTags}
      onChange={(selectedList) => {
        const selectedRecipeTags = selectedList.map((item) => item.id);
        setFilter({ recipeTagIds: selectedRecipeTags });
      }}
      selectLabel="Recipe tags"
      list={data ?? []}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
    />
  );
}
