import calculatePaginationElements, { calculatePaginationMeta } from "@/util/calculatePaginationElements";
import { useRecipeTagsCrudListActions, useRecipeTagsCrudListState } from "../reducers/RecipeTagsCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import RecipeTagsFilterBar from "../components/RecipeTagsFilterBar";
import RecipeTagsTable from "../components/RecipeTagsTable";
import { ViewType } from "@/components/ViewSegmentedButton";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import qs from "qs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchRecipeTagsQuery } from "@/apis/RecipeTagsApi";

export default function RecipeTagsPage() {
  const navigate = useNavigate();

  const { recipeTagsQuery } = useRecipeTagsCrudListState();
  const { setSearch, setPage, setLimit, setSortBy } = useRecipeTagsCrudListActions();
  const {
    recipeTagsQuery: { search },
  } = useRecipeTagsCrudListState();
  const { data: results, isError } = useSearchRecipeTagsQuery(recipeTagsQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemEndOnPage, numItemStartOnPage, searchTermUsed, totalPages } = calculatePaginationMeta(recipeTagsQuery.limit ?? 25, results);

  const recipeTagsTable = useMemo(() => {
    return <RecipeTagsTable data={results?.items ?? []} />;
  }, [results?.items]);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        searchTerm={recipeTagsQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        pageTitle="Recipe Tags"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Recipe Tag
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={
          <CrudListPageLayout.Header.Filters>
            <RecipeTagsFilterBar />
          </CrudListPageLayout.Header.Filters>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="recipe tags" searchTermUsed={search} />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {totalItems === 0 || isError ? <NoResultsFound title="Oops! No recipe tags found" description="Try searching with different keywords or check the spelling." /> : recipeTagsTable}
          </CrudListPageLayout.Body.Content>
        }
        itemsPerPageCountSelectorComponent={
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(recipeTagsQuery.limit ?? 25)}
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
