import { useProductsCrudListActions, useProductsCrudListState } from "../reducers/ProductsCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import ProductGrid from "../components/ProductGrid";
import ProductsFilterBar from "../components/ProductsFilterBar";
import ProductsTable from "../components/ProductsTable";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchProductsQuery } from "@/apis/ProductsApi";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { productsQuery, view } = useProductsCrudListState();
  const { setView, setSearch, setPage, setLimit } = useProductsCrudListActions();
  const { data: results, isError } = useSearchProductsQuery(productsQuery);

  const productsTable = useMemo(() => {
    return <ProductsTable data={results?.items ?? []} />;
  }, [results?.items]);

  const productsGrid = useMemo(() => {
    return (
      <ProductGrid
        products={results?.items ?? []}
        onClick={(product) => {
          navigate(`./view/${product.productId}`);
        }}
      />
    );
  }, [navigate, results?.items]);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        searchTerm={productsQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        pageTitle="Products"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Add New Product
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={
          <CrudListPageLayout.Header.Filters>
            <ProductsFilterBar />
          </CrudListPageLayout.Header.Filters>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={results?.meta?.totalItems ?? 0} itemsStart={1} itemsEnd={results?.meta?.totalItems ?? 0} itemDescription="products" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !results?.items || results.items.length === 0 ? <NoResultsFound title="Oops! No products found" description="Try adding a new product to get started." /> : view === "grid" ? productsGrid : productsTable}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
