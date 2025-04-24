import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import MealPlanTable from "../components/MealPlanTable";
import NoResultsFound from "@/components/NoResultsFound";
import { useGetConcreteRecipesQuery } from "@/apis/ConcreteRecipeApi";
import { useNavigate } from "react-router-dom";

export default function MealPlansPage() {
  const navigate = useNavigate();
  const { data: mealPlans, isError } = useGetConcreteRecipesQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Meal Plans"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./select-recipe")}>
              <FaPlus />
              &ensp;Create Meal Plan
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={mealPlans?.length ?? 0} itemsStart={1} itemsEnd={mealPlans?.length ?? 0} itemDescription="meal plans" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !mealPlans || mealPlans.length === 0 ? <NoResultsFound title="Oops! No meal plans found" description="Try creating a new meal plan to get started." /> : <MealPlanTable data={mealPlans} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
