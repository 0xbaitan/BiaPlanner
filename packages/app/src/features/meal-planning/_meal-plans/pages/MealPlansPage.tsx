import { useConcreteRecipesCrudListActions, useConcreteRecipesCrudListState } from "../../reducers/ConcreteRecipesCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import ConcreteRecipesFilterBar from "../components/ConcreteRecipesFilterBar";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import MealPlanTable from "../components/MealPlanTable";
import NoResultsFound from "@/components/NoResultsFound";
import { RoutePaths } from "@/Routes";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchConcreteRecipesQuery } from "@/apis/ConcreteRecipeApi";

export default function MealPlansPage() {
  const navigate = useNavigate();
  const { concreteRecipesQuery } = useConcreteRecipesCrudListState();
  const { setSearch, setPage, setLimit } = useConcreteRecipesCrudListActions();
  const { data: results, isError } = useSearchConcreteRecipesQuery(concreteRecipesQuery);

  const mealPlanTable = useMemo(() => {
    return <MealPlanTable data={results?.data ?? []} />;
  }, [results?.data]);

  const { itemsPerPage: limit, searchTermUsed, currentPage, numItemEndOnPage, numItemStartOnPage, totalItems, totalPages } = calculatePaginationElements(concreteRecipesQuery.limit ?? 25, results);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        searchTerm={concreteRecipesQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        pageTitle="Meal Plans"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate(RoutePaths.MEAL_PLANS_CREATE)}>
              <FaPlus />
              &ensp;Create Meal Plan
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
        filtersComponent={<ConcreteRecipesFilterBar />}
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount itemsEnd={numItemEndOnPage} itemsStart={numItemStartOnPage} totalItems={totalItems} searchTermUsed={searchTermUsed} itemDescription="meal plans" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !results?.data || results.data.length === 0 ? <NoResultsFound title="Oops! No meal plans found" description="Try creating a new meal plan to get started." /> : mealPlanTable}
          </CrudListPageLayout.Body.Content>
        }
        itemsPerPageCountSelectorComponent={
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(limit ?? 25)}
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
