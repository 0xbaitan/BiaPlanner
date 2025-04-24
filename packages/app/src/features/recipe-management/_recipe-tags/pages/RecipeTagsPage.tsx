import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import RecipeTagsTable from "../components/RecipeTagsTable";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";
import { useNavigate } from "react-router-dom";

export default function RecipeTagsPage() {
  const navigate = useNavigate();
  const { data: recipeTags, isSuccess, isError } = useGetRecipeTagsQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Recipe Tags"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Recipe Tag
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={recipeTags?.length ?? 0} itemsStart={1} itemsEnd={recipeTags?.length ?? 0} itemDescription="recipe tags" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !recipeTags || recipeTags.length === 0 ? <NoResultsFound title="Oops! No recipe tags found" description="Try creating a new recipe tag to get started." /> : <RecipeTagsTable data={recipeTags} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
