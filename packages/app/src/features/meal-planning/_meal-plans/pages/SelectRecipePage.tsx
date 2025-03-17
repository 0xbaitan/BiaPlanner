import RecipeGrid from "../components/RecipeGrid";
import { useGetRecipesQuery } from "@/apis/RecipeApi";

export default function SelectRecipePage() {
  const { data: recipes, isError, isLoading, isSuccess } = useGetRecipesQuery();
  return (
    <div>
      <h2>Select Recipe</h2>
      {isError ? <ErrorStatus /> : isLoading ? <LoadingStatus /> : isSuccess ? <RecipeGrid recipes={recipes} /> : null}
    </div>
  );
}

function ErrorStatus() {
  return <div>There was an error</div>;
}

function LoadingStatus() {
  return <div>Loading...</div>;
}
