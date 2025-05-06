import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../../meal-planning/reducers/RecipesCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import RecipeGrid from "@/components/layouts/RecipeGrid";
import RecipesFilterBar from "../components/RecipesFilterBar";
import RecipesTable from "../components/RecipesTable";
import { RoutePaths } from "@/Routes";
import { ViewType } from "@/components/ViewSegmentedButton";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import qs from "qs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchRecipesQuery } from "@/apis/RecipeApi";

export default function RecipesListPage() {
  const navigate = useNavigate();

  const { recipesQuery, view } = useRecipesCrudListState();
  const { setView, setSearch, setPage } = useRecipesCrudListActions();
  const {
    recipesQuery: { limit },
  } = useRecipesCrudListState();
  console.log("recipesQuery", qs.stringify(recipesQuery));
  const { setLimit } = useRecipesCrudListActions();
  const {
    data: results,

    isError,
  } = useSearchRecipesQuery(recipesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemEndOnPage, numItemStartOnPage, searchTermUsed, totalPages } = calculatePaginationElements(recipesQuery.limit ?? 25, results);

  const recipesTable = useMemo(() => {
    return <RecipesTable data={results?.data ?? []} />;
  }, [results?.data]);

  const recipesGrid = useMemo(() => {
    return (
      <RecipeGrid
        recipes={results?.data ?? []}
        onClick={(recipe) => {
          navigate(`./view/${recipe.id}`);
        }}
      />
    );
  }, [navigate, results?.data]);

  return (
    <AuthorisationSieve
      permissionIndex={{
        area: "recipe",
        key: "viewList",
      }}
      type={AuthorisationSieveType.REDIRECT_TO_404}
    >
      <CrudListPageLayout>
        <CrudListPageLayout.Header
          searchTerm={recipesQuery.search}
          onSearch={(searchTerm) => {
            setSearch(searchTerm);
          }}
          pageTitle="Recipes"
          actionsComponent={
            <CrudListPageLayout.Header.Actions>
              <AuthorisationSieve
                permissionIndex={{
                  area: "recipe",
                  key: "createItem",
                }}
                type={AuthorisationSieveType.NULLIFY}
              >
                <Button variant="primary" onClick={() => navigate(RoutePaths.RECIPES_CREATE)}>
                  <FaPlus />
                  &ensp;Create Recipe
                </Button>
              </AuthorisationSieve>
            </CrudListPageLayout.Header.Actions>
          }
          filtersComponent={
            <CrudListPageLayout.Header.Filters>
              <RecipesFilterBar />
            </CrudListPageLayout.Header.Filters>
          }
        />

        <CrudListPageLayout.Body
          resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="recipes" searchTermUsed={searchTermUsed} />}
          contentComponent={
            <CrudListPageLayout.Body.Content>
              {totalItems === 0 || isError ? <NoResultsFound title={"Oops! No recipes found"} description={"Try searching with different keywords or check the spelling."} /> : view === "grid" ? recipesGrid : recipesTable}
            </CrudListPageLayout.Body.Content>
          }
          itemsPerPageCountSelectorComponent={
            <CrudListPageLayout.Body.ItemsPerPageCountSelector
              itemsCount={constrainItemsPerPage(limit)}
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
