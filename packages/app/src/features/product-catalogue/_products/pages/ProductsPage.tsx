import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useProductsCrudListActions, useProductsCrudListState } from "../reducers/ProductsCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import ProductGrid from "../components/ProductGrid";
import ProductsFilterBar from "../components/ProductsFilterBar";
import ProductsTable from "../components/ProductsTable";
import { ViewType } from "@/components/ViewSegmentedButton";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchProductsQuery } from "@/apis/ProductsApi";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { productsQuery, view } = useProductsCrudListState();
  const { setSearch, setPage, setLimit, setView } = useProductsCrudListActions();
  const {
    data: results,
    isError,
    isLoading,
  } = useSearchProductsQuery(productsQuery, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemStartOnPage, numItemEndOnPage, searchTermUsed, totalPages } = calculatePaginationElements(productsQuery.limit ?? 25, results);

  const productsTable = useMemo(() => {
    return <ProductsTable data={results?.data ?? []} offset={numItemStartOnPage - 1} />;
  }, [numItemStartOnPage, results?.data]);

  const productsGrid = useMemo(() => {
    return (
      <ProductGrid
        products={results?.data ?? []}
        onClick={(product) => {
          navigate(fillParametersInPath(RoutePaths.PRODUCTS_VIEW, { id: product.id }));
        }}
      />
    );
  }, [navigate, results?.data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "product",
        key: "viewList",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <CrudListPageLayout>
        <CrudListPageLayout.Header
          searchTerm={productsQuery.search}
          onSearch={(searchTerm) => {
            setSearch(searchTerm);
          }}
          pageTitle="Products"
          actionsComponent={
            <CrudListPageLayout.Header.Actions>
              <AuthorisationSieve
                permissionIndex={{
                  area: "product",
                  key: "createItem",
                }}
                type={AuthorisationSieveType.NULLIFY}
              >
                <Button variant="primary" onClick={() => navigate(RoutePaths.PRODUCTS_CREATE)}>
                  <FaPlus />
                  &ensp;Create Product
                </Button>
              </AuthorisationSieve>
            </CrudListPageLayout.Header.Actions>
          }
          filtersComponent={
            <CrudListPageLayout.Header.Filters>
              <ProductsFilterBar />
            </CrudListPageLayout.Header.Filters>
          }
        />

        <CrudListPageLayout.Body
          resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="products" searchTermUsed={searchTermUsed} />}
          contentComponent={
            <CrudListPageLayout.Body.Content>
              {isError || !results?.data || results.data.length === 0 ? <NoResultsFound title="Oops! No products found" description="Try adding a new product to get started." /> : view === "grid" ? productsGrid : productsTable}
            </CrudListPageLayout.Body.Content>
          }
          itemsPerPageCountSelectorComponent={
            <CrudListPageLayout.Body.ItemsPerPageCountSelector
              itemsCount={constrainItemsPerPage(productsQuery.limit ?? 25)}
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
