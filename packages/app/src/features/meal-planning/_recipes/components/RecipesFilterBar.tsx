import FilterBar from "@/components/forms/FilterBar";
import { useGetAllergensQuery } from "@/apis/ProductCategoryApi";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";

export type RecipeFilterBarProps = {};
export default function RecipesFilterBar() {
  return (
    <FilterBar>
      <FilterBar.Group type="prominent-filters">
        <CuisineProminentMultiselect />
        <AllergenProminentMultiselect />
      </FilterBar.Group>
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
