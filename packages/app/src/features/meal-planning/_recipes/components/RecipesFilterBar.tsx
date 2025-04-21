import "../styles/RecipeFilterBar.scss";

import { DifficultyLevels, ICuisine, IRecipeTag } from "@biaplanner/shared";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useCuisinesPrefetch, useGetCuisinesQuery } from "@/apis/CuisinesApi";

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

  if (!data || isError || isLoading) {
    return <div>Failed to fetch cuisines</div>;
  }
  return (
    <FilterBar.Select
      multiselectLabel="Cuisines"
      list={isSuccess ? data : []}
      onChange={() => {}}
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

  if (!data || isError || isLoading) {
    return <div>Failed to fetch allergens</div>;
  }

  return <FilterBar.Select multiselectLabel="Allergens excluded" loading={isLoading} disabled={isLoading || isError || data?.length === 0} list={data ?? []} idSelector={(item) => item.id} nameSelector={(item) => item.name} />;
}

function DifficultyLevelMultiselect() {
  const options = useMemo(() => {
    let entries = Object.entries(DifficultyLevels).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}`, value }));
    return entries;
  }, []);

  return <FilterBar.Select multiselectLabel="Difficulty level" list={options} idSelector={(item) => item.value} nameSelector={(item) => item.label} />;
}

function RecipeTagsMultiselect() {
  const { data, isError, isLoading, isSuccess } = useGetRecipeTagsQuery();

  const [selectedTags, setSelectedTags] = useState<IRecipeTag[]>([]);
  if (!data || isError || isLoading) {
    return <div>Failed to fetch recipe tags</div>;
  }
  return (
    <FilterBar.Select
      selectedValues={selectedTags}
      onChange={(selectedList) => {
        setSelectedTags(selectedList);
      }}
      multiselectLabel="Recipe tags"
      list={data ?? []}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
    />
  );
}
