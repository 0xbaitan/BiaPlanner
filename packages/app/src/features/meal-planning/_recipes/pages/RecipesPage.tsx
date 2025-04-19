import Button from "react-bootstrap/esm/Button";
import FilterMultiselect from "@/components/forms/FilterMultiselect";
import { IRecipe } from "@biaplanner/shared";
import RecipesTable from "../components/RecipesTable";
import { useGetRecipesQuery } from "@/apis/RecipeApi";
import { useNavigate } from "react-router-dom";

export default function RecipesPage() {
  const navigate = useNavigate();
  const {
    data: recipes,

    isError,
    isLoading,
  } = useGetRecipesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !recipes) {
    return <div>Failed to fetch recipes</div>;
  }

  return (
    <div>
      <h1>Recipes Page</h1>

      <Button onClick={() => navigate("./create")}>Create Recipe</Button>
      <RecipesTable data={recipes} />
      <FilterMultiselect<IRecipe>
        list={recipes}
        idSelector={(item) => item.id}
        nameSelector={(item) => item.title}
        selectedValues={[]}
        onChange={(selectedList, selectedOptions) => {
          console.log("Selected List:", selectedList);
          console.log("Selected Options:", selectedOptions);
        }}
        className="mb-3"
        error={""}
        placeholder="Select recipes"
        multi={true}
      />
    </div>
  );
}
