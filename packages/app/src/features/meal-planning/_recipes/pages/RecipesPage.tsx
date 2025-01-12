import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export default function RecipesPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Recipes Page</h1>

      <Button onClick={() => navigate("./create")}>Create Recipe</Button>
    </div>
  );
}
