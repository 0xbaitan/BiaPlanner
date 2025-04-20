import "../styles/RecipeFilterBar.scss";

import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import { DifficultyLevels } from "@biaplanner/shared";
import FilterBar from "@/components/forms/FilterBar";
import Row from "react-bootstrap/esm/Row";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useGetAllergensQuery } from "@/apis/ProductCategoryApi";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";
import { useMemo } from "react";

export type RecipeFilterBarProps = {};
export default function RecipesFilterBar() {
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
  const { data: cuisines, isError, isLoading } = useGetCuisinesQuery();
  return <FilterBar.Select multiselectLabel="Cuisines" loading={isLoading} disabled={isLoading || isError} list={cuisines ?? []} idSelector={(item) => item.id} nameSelector={(item) => item.name} />;
}

function AllergenProminentMultiselect() {
  const { data: allergens, isError, isLoading } = useGetAllergensQuery();
  return <FilterBar.Select multiselectLabel="Allergens excluded" loading={isLoading} disabled={isLoading || isError} list={allergens ?? []} idSelector={(item) => item.id} nameSelector={(item) => item.name} />;
}

function DifficultyLevelMultiselect() {
  const options = useMemo(() => {
    let entries = Object.entries(DifficultyLevels).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}`, value }));
    return entries;
  }, []);

  return <FilterBar.Select multiselectLabel="Difficulty level" list={options} idSelector={(item) => item.value} nameSelector={(item) => item.label} />;
}

function RecipeTagsMultiselect() {
  const { data: tags, isError, isLoading } = useGetRecipeTagsQuery();

  return <FilterBar.Select multiselectLabel="Recipe tags" loading={isLoading} disabled={isLoading || isError} list={tags ?? []} idSelector={(item) => item.id} nameSelector={(item) => item.name} />;
}
