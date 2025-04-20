import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownPane from "@/components/DropdownPane";
import FilterMultiselect from "@/components/forms/FilterMultiselect";
import { IRecipe } from "@biaplanner/shared";
import RecipesFilterBar from "../components/RecipesFilterBar";
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
      <RecipesFilterBar />
      <DropdownPane toggleText="Click me" toggleId="some-id">
        Hi
      </DropdownPane>
    </div>
  );
}
