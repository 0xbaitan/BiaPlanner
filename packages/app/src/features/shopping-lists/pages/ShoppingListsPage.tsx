import { useShoppingListsCrudListActions, useShoppingListsCrudListState } from "../reducers/ShoppingListsCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { RoutePaths } from "@/Routes";
import ShoppingListTable from "../components/ShoppingListTable";
import ShoppingListsFilterBar from "../components/ShoppingListsFilterBar";
import { useNavigate } from "react-router-dom";
import { useSearchShoppingListsQuery } from "@/apis/ShoppingListsApi";

function ShoppingListsPage() {
  const navigate = useNavigate();
  const { shoppingListsQuery } = useShoppingListsCrudListState();
  const { setSearch } = useShoppingListsCrudListActions();
  const { data: results, isLoading, isError } = useSearchShoppingListsQuery(shoppingListsQuery);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        searchTerm={shoppingListsQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        pageTitle="Shopping Lists"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate(RoutePaths.SHOPPING_LISTS_CREATE)}>
              <FaPlus />
              &ensp;Create Shopping List
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={<ShoppingListsFilterBar />}
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={results?.meta?.totalItems ?? 0} itemsStart={1} itemsEnd={results?.meta?.totalItems ?? 0} itemDescription="shopping lists" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isLoading && <div>Loading...</div>}
            {isError && <NoResultsFound title="Error" description="Error loading shopping lists." />}
            {results?.items.length === 0 && <NoResultsFound title="No Shopping Lists Found" description="Try creating a new shopping list to get started." />}
            {results?.items && results.items.length > 0 && <ShoppingListTable data={results.items} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}

export default ShoppingListsPage;
