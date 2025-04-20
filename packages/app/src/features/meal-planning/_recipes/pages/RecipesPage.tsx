import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownPane from "@/components/DropdownPane";
import { FaPlus } from "react-icons/fa";
import FilterMultiselect from "@/components/forms/FilterMultiselect";
import { IRecipe } from "@biaplanner/shared";
import RecipeGrid from "../../_meal-plans/components/RecipeGrid";
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
    <CrudListPageLayout>
      <CrudListPageLayout.Header pageTitle="Recipes">
        <CrudListPageLayout.Header.Actions>
          <Button variant="primary" onClick={() => navigate("./create")}>
            <FaPlus />
            &ensp;Create Recipe
          </Button>
        </CrudListPageLayout.Header.Actions>
        <CrudListPageLayout.Header.Filters>
          <RecipesFilterBar />
        </CrudListPageLayout.Header.Filters>
      </CrudListPageLayout.Header>
      <CrudListPageLayout.Body>
        <CrudListPageLayout.Body.ResultsCount itemsStart={1} itemsEnd={4} totalItems={10} itemDescription="recipes" />

        <CrudListPageLayout.Body.ItemsPerPageCountSelector itemsCount={10} onChange={(pageSize) => {}} />
        <CrudListPageLayout.Body.Content>
          <RecipeGrid recipes={recipes} />
        </CrudListPageLayout.Body.Content>
      </CrudListPageLayout.Body>
      <CrudListPageLayout.Footer>
        <CrudListPageLayout.Footer.Pagination
          paginationProps={{
            currentPage: 1,
            numPages: 10,
            onPageChange: (page) => {
              console.log("Page changed to", page);
            },
          }}
        />
      </CrudListPageLayout.Footer>
    </CrudListPageLayout>
  );
}
