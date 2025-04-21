import "../styles/RecipeFilterBar.scss";

import { DifficultyLevels, ICuisine, IProductCategory, IRecipeTag } from "@biaplanner/shared";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useCuisinesPrefetch, useGetCuisinesQuery } from "@/apis/CuisinesApi";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../reducers/RecipesCrudListReducer";

import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import FilterBar from "@/components/forms/FilterBar";
import Row from "react-bootstrap/esm/Row";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useGetAllergensQuery } from "@/apis/ProductCategoryApi";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";

export type RecipeFilterBarProps = {};
export default function RecipesFilterBar() {
  useCuisinesPrefetch();

  return (
    <FilterBar>
      <FilterBar.Group type="prominent-filters">
        <CuisineProminentMultiselect />
        <AllergenProminentMultiselect />
      </FilterBar.Group>
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
      <FilterBar.ResetButton />
      <FilterBar.Group type="sorter">
        <FilterBar.Sorter>
          <option value="name">Name</option>
          <option value="createdAt">Created At</option>
          <option value="updatedAt">Updated At</option>
        </FilterBar.Sorter>
      </FilterBar.Group>
    </FilterBar>
  );
}

function CuisineProminentMultiselect() {
  const { data, isError, isSuccess, isLoading, isFetching } = useGetCuisinesQuery();
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
    <FilterBar.Select
      multiselectLabel="Cuisines"
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

function AllergenProminentMultiselect() {
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
    <FilterBar.Select
      multiselectLabel="Allergens excluded"
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

function DifficultyLevelMultiselect() {
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
    <FilterBar.Select
      multiselectLabel="Difficulty level"
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

function RecipeTagsMultiselect() {
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
    <FilterBar.Select
      selectedValues={mappedRecipeTags}
      onChange={(selectedList) => {
        const selectedRecipeTags = selectedList.map((item) => item.id);
        setFilter({ recipeTagIds: selectedRecipeTags });
      }}
      multiselectLabel="Recipe tags"
      list={data ?? []}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
    />
  );
}
