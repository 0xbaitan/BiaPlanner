import FilterBar from "@/components/forms/FilterBar";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";

export type RecipeFilterBarProps = {};
export default function RecipesFilterBar() {
  return (
    <FilterBar>
      <CuisineProminentMultiselect />
    </FilterBar>
  );
}

function CuisineProminentMultiselect() {
  const { data: cuisines, isError, isLoading } = useGetCuisinesQuery();
  return <FilterBar.ProminentMultiselect multiselectLabel="Cuisines" loading={isLoading} disabled={isLoading || isError} list={cuisines ?? []} idSelector={(item) => item.id} nameSelector={(item) => item.name} />;
}
