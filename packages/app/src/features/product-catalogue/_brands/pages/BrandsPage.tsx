import { useBrandsCrudListActions, useBrandsCrudListState } from "../reducers/BrandsCrudListReducer";

import BrandsFilterBar from "../components/BrandsFilterBar";
import BrandsTable from "../components/BrandsTable";
import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { calculatePaginationMeta } from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useNavigate } from "react-router-dom";
import { useSearchBrandsQuery } from "@/apis/BrandsApi";

export default function BrandsPage() {
  const navigate = useNavigate();
  const { brandsQuery } = useBrandsCrudListState();
  const { setSearch, setLimit, setPage } = useBrandsCrudListActions();
  const { data: brands, isError } = useSearchBrandsQuery(brandsQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemStartOnPage, numItemEndOnPage, totalPages } = calculatePaginationMeta(brandsQuery.limit ?? 25, brands);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Brands"
        searchTerm={brandsQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Brand
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={<BrandsFilterBar />}
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="brands" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !brands?.items || brands.items.length === 0 ? <NoResultsFound title="Oops! No brands found" description="Try creating a new brand to get started." /> : <BrandsTable data={brands.items} />}
          </CrudListPageLayout.Body.Content>
        }
        itemsPerPageCountSelectorComponent={
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(brandsQuery.limit ?? 25)}
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
