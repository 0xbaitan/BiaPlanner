import { useProductCategoriesCrudListActions, useProductCategoriesCrudListState } from "../reducers/ProductCategoriesCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import ProductCategoriesFilterBar from "../components/ProductCategoriesFilterBar";
import ProductCategoriesTable from "../components/ProductCategoriesTable";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export default function ProductCategoriesPage() {
  const navigate = useNavigate();
  const { productCategoriesQuery } = useProductCategoriesCrudListState();
  const { setSearch, setPage, setLimit, resetAll } = useProductCategoriesCrudListActions();
  const { data: productCategories, isError } = useSearchProductCategoriesQuery(productCategoriesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemStartOnPage, numItemEndOnPage, totalPages } = calculatePaginationElements(productCategoriesQuery.limit ?? 25, productCategories);

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, [resetAll]);
  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Product Categories"
        searchTerm={productCategoriesQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Product Category
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={
          <CrudListPageLayout.Header.Filters>
            <ProductCategoriesFilterBar />
          </CrudListPageLayout.Header.Filters>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="product categories" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !productCategories?.data || productCategories.data.length === 0 ? (
              <NoResultsFound title="Oops! No product categories found" description="Try creating a new product category to get started." />
            ) : (
              <ProductCategoriesTable data={productCategories.data} />
            )}
          </CrudListPageLayout.Body.Content>
        }
        itemsPerPageCountSelectorComponent={
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(productCategoriesQuery.limit ?? 25)}
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
