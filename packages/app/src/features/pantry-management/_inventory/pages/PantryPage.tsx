import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import PantryItemsTable from "../components/PantryItemsTable";
import { useGetPantryItemsQuery } from "@/apis/PantryItemsApi";
import { useNavigate } from "react-router-dom";

function PantryPage() {
  const navigate = useNavigate();
  const { data: pantryItems, isError, isLoading, isSuccess } = useGetPantryItemsQuery({});

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Pantry"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("/pantry/inventory/add-item")}>
              <FaPlus />
              &ensp;Add New Item
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={pantryItems?.length ?? 0} itemsStart={1} itemsEnd={pantryItems?.length ?? 0} itemDescription="pantry items" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isLoading && <div>Loading...</div>}
            {isError && <NoResultsFound title="Error" description="Failed to fetch pantry items." />}
            {isSuccess && pantryItems.length === 0 && <NoResultsFound title="No Pantry Items Found" description="Try adding a new item to your pantry to get started." />}
            {isSuccess && pantryItems.length > 0 && <PantryItemsTable data={pantryItems} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}

PantryPage.path = "/pantry/inventory";

export default PantryPage;
