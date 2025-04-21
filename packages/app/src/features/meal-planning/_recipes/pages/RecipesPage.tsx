import React, { useEffect, useMemo, useState } from "react";
import { useGetRecipesQuery, useSearchRecipesQuery } from "@/apis/RecipeApi";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../reducers/RecipesCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownPane from "@/components/DropdownPane";
import { FaPlus } from "react-icons/fa";
import FilterMultiselect from "@/components/forms/FilterMultiselect";
import { IRecipe } from "@biaplanner/shared";
import NoResultsFound from "@/components/NoResultsFound";
import RecipeGrid from "@/components/layouts/RecipeGrid";
import RecipesFilterBar from "../components/RecipesFilterBar";
import RecipesTable from "../components/RecipesTable";
import { ViewType } from "@/components/ViewSegmentedButton";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import qs from "qs";
import useDefaultStatusToast from "@/hooks/useDefaultStatusToast";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";

export default function RecipesPage() {
  const navigate = useNavigate();

  const { recipesQuery, view } = useRecipesCrudListState();
  const { setView, setSearch } = useRecipesCrudListActions();

  console.log("recipesQuery", qs.stringify(recipesQuery));

  const {
    data: results,

    isError,
    isLoading,
    isFetching,
  } = useSearchRecipesQuery(recipesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, itemsPerPage, numItemEndOnPage, numItemStartOnPage, numItems, searchTermUsed, totalPages } = calculatePaginationElements(recipesQuery.limit ?? 25, results);

  const recipesTable = useMemo(() => {
    return <RecipesTable data={results?.data ?? []} />;
  }, [results?.data]);

  const recipesGrid = useMemo(() => {
    return <RecipeGrid recipes={results?.data ?? []} />;
  }, [results?.data]);

  return (
    // <div>hi</div>
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        searchTerm={recipesQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        pageTitle="Recipes"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Recipe
            </Button>
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
            itemsCount={10}
            onChange={(count) => {
              console.log(count);
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
                console.log(page);
              },
            }}
          />
        }
      />
    </CrudListPageLayout>
  );
}
