import { usePantryItemsCrudListActions, usePantryItemsCrudListState } from "../reducers/PantryItemsCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import PantryItemsFilterBar from "../components/PantryItemsFilterBar";
import PantryItemsTable from "../components/PantryItemsTable";
import { RoutePaths } from "@/Routes";
import { useNavigate } from "react-router-dom";
import { useSearchPantryItemsQuery } from "@/apis/PantryItemsApi";

function PantryPage() {
  const navigate = useNavigate();
  const { pantryItemsQuery } = usePantryItemsCrudListState();
  const { setSearch } = usePantryItemsCrudListActions();
  const { data: results, isLoading, isError } = useSearchPantryItemsQuery(pantryItemsQuery);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        searchTerm={pantryItemsQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        pageTitle="Pantry"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate(RoutePaths.PANTRY_ADD_ITEM)}>
              <FaPlus />
              &ensp;Add New Item
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={<PantryItemsFilterBar />}
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={results?.meta?.totalItems ?? 0} itemsStart={1} itemsEnd={results?.meta?.totalItems ?? 0} itemDescription="pantry items" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isLoading && <div>Loading...</div>}
            {isError && <NoResultsFound title="Error" description="Failed to fetch pantry items." />}
            {results?.data.length === 0 && <NoResultsFound title="No Pantry Items Found" description="Try adding a new item to your pantry to get started." />}
            {results?.data && results.data.length > 0 && <PantryItemsTable data={results.data} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}

export default PantryPage;
