import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export default function MealPlansPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Meal Plans</h1>
      <Button onClick={() => navigate("./create")}>Create Meal Plan</Button>
    </div>
  );
}
