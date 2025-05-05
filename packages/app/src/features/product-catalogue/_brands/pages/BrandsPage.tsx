import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useBrandsCrudListActions, useBrandsCrudListState } from "../reducers/BrandsCrudListReducer";

import BrandGrid from "../components/BrandGrid";
import BrandsFilterBar from "../components/BrandsFilterBar";
import BrandsTable from "../components/BrandsTable";
import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { ViewType } from "@/components/ViewSegmentedButton";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchBrandsQuery } from "@/apis/BrandsApi";

export default function BrandsPage() {
  const navigate = useNavigate();
  const { brandsQuery, view } = useBrandsCrudListState();
  const { setView, setSearch, setPage, setLimit } = useBrandsCrudListActions();
  const { data: results, isError } = useSearchBrandsQuery(brandsQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemStartOnPage, numItemEndOnPage, totalPages } = useMemo(() => {
    return calculatePaginationElements(brandsQuery.limit ?? 25, results);
  }, [brandsQuery.limit, results]);

  const brandsTable = useMemo(() => {
    return <BrandsTable data={results?.data ?? []} offset={numItemStartOnPage} />;
  }, [numItemStartOnPage, results?.data]);

  const brandsGrid = useMemo(() => {
    return (
      <BrandGrid
        brands={results?.data ?? []}
        onClick={(brand) => {
          navigate(fillParametersInPath(RoutePaths.BRANDS_VIEW, { id: brand.id }));
        }}
      />
    );
  }, [navigate, results?.data]);

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "brand",
        key: "viewList",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <CrudListPageLayout>
        <CrudListPageLayout.Header
          searchTerm={brandsQuery.search}
          onSearch={(searchTerm) => {
            setSearch(searchTerm);
          }}
          pageTitle="Brands"
          actionsComponent={
            <CrudListPageLayout.Header.Actions>
              <AuthorisationSieve
                permissionIndex={{
                  area: "brand",
                  key: "createItem",
                }}
                type={AuthorisationSieveType.NULLIFY}
              >
                <Button variant="primary" onClick={() => navigate(RoutePaths.BRANDS_CREATE)}>
                  <FaPlus />
                  &ensp;Create Brand
                </Button>
              </AuthorisationSieve>
            </CrudListPageLayout.Header.Actions>
          }
          filtersComponent={<BrandsFilterBar />}
        />

        <CrudListPageLayout.Body
          resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="brands" />}
          contentComponent={
            <CrudListPageLayout.Body.Content>
              {totalItems === 0 || isError ? <NoResultsFound title={"Oops! No brands found"} description={"Try searching with different keywords or check the spelling."} /> : view === "grid" ? brandsGrid : brandsTable}
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
          viewSegmentedButtonComponent={
            <CrudListPageLayout.Body.ViewSegmentedButton
              view={view}
              onChange={(view: ViewType) => {
                setView(view);
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
    </AuthorisationSieve>
  );
}
