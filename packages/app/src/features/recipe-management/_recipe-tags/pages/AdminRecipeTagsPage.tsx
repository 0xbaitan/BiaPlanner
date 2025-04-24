import Button from "react-bootstrap/esm/Button";
import RecipeTagsTable from "../components/RecipeTagsTable";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";
import { useNavigate } from "react-router-dom";

export default function AdminRecipeTagsPage() {
  const { data: recipeTags, isSuccess, isError } = useGetRecipeTagsQuery();

  return (
    <div>
      <h1>Recipe Tags</h1>
      <NavigateToCreateRecipeTagPage />
      {isSuccess && recipeTags && <RecipeTagsTable data={recipeTags} />}
      {isError && <div>Failed to fetch recipe tags</div>}
    </div>
  );
}

function NavigateToCreateRecipeTagPage() {
  const navigate = useNavigate();

  return <Button onClick={() => navigate("./create")}>Create Recipe Tag</Button>;
}
