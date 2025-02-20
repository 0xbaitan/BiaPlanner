import Button from "react-bootstrap/esm/Button";
import MealPlanTable from "../components/MealPlanTable";
import { useGetConcreteRecipesQuery } from "@/apis/ConcreteRecipeApi";
import { useNavigate } from "react-router-dom";

export default function MealPlansPage() {
  const navigate = useNavigate();
  const { data: mealPlans } = useGetConcreteRecipesQuery();

  return (
    <div>
      <h1>Meal Plans</h1>
      <Button onClick={() => navigate("./create")}>Create Meal Plan</Button>
      <MealPlanTable data={mealPlans ?? []} />
    </div>
  );
}
