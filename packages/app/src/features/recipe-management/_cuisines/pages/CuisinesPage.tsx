import { useCuisinesCrudListActions, useCuisinesCrudListState } from "../reducers/CuisinesCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import CuisinesFilterBar from "../components/CuisinesFilterBar";
import CuisinesTable from "../components/CuisinesTable";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { RoutePaths } from "@/Routes";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useNavigate } from "react-router-dom";
import { useSearchCuisinesQuery } from "@/apis/CuisinesApi";

export default function CuisinesPage() {
  const navigate = useNavigate();
  const { cuisinesQuery } = useCuisinesCrudListState();
  const { setSearch, setPage, setLimit } = useCuisinesCrudListActions();
  const { data: cuisines, isError } = useSearchCuisinesQuery(cuisinesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemStartOnPage, numItemEndOnPage, searchTermUsed, totalPages } = calculatePaginationElements(cuisinesQuery.limit ?? 25, cuisines);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Cuisines"
        searchTerm={cuisinesQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate(RoutePaths.CUISINES_CREATE)}>
              <FaPlus />
              &ensp;Create Cuisine
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={
          <CrudListPageLayout.Header.Filters>
            <CuisinesFilterBar />
          </CrudListPageLayout.Header.Filters>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="cuisines" searchTermUsed={searchTermUsed} />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !cuisines?.data || cuisines.data.length === 0 ? <NoResultsFound title="Oops! No cuisines found" description="Try creating a new cuisine to get started." /> : <CuisinesTable data={cuisines.data} />}
          </CrudListPageLayout.Body.Content>
        }
        itemsPerPageCountSelectorComponent={
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(cuisinesQuery.limit ?? 25)}
            onChange={(limit) => {
              setLimit(limit);
            }}
          />
        }
      />

      <CrudListPageLayout.Footer
        paginationComponent={
          <CrudListPageLayout.Footer.Pagination
            paginationProps={{
              numPages: totalPages,
              currentPage,
              onPageChange: (page) => {
                setPage(page);
              },
            }}
          />
        }
      />
    </CrudListPageLayout>
  );
}
