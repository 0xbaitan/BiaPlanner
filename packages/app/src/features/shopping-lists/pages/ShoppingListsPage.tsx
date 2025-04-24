import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { RoutePaths } from "@/Routes";
import ShoppingListTable from "../components/ShoppingListTable";
import { useGetShoppingListsQuery } from "@/apis/ShoppingListsApi";
import { useNavigate } from "react-router-dom";

function ShoppingListsPage() {
  const navigate = useNavigate();
  const { data: shoppingLists, isLoading, isError, isSuccess } = useGetShoppingListsQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Shopping Lists"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate(RoutePaths.SHOPPING_LISTS_CREATE)}>
              <FaPlus />
              &ensp;Create Shopping List
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={shoppingLists?.length ?? 0} itemsStart={1} itemsEnd={shoppingLists?.length ?? 0} itemDescription="shopping lists" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isLoading && <div>Loading...</div>}
            {isError && <NoResultsFound title="Error" description="Error loading shopping lists." />}
            {isSuccess && shoppingLists.length === 0 && <NoResultsFound title="No Shopping Lists Found" description="Try creating a new shopping list to get started." />}
            {isSuccess && shoppingLists.length > 0 && <ShoppingListTable data={shoppingLists} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}

export default ShoppingListsPage;
