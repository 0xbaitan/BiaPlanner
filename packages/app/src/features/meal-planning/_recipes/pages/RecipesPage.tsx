import React, { useEffect, useMemo, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownPane from "@/components/DropdownPane";
import { FaPlus } from "react-icons/fa";
import FilterMultiselect from "@/components/forms/FilterMultiselect";
import { IRecipe } from "@biaplanner/shared";
import RecipeGrid from "../../_meal-plans/components/RecipeGrid";
import RecipesFilterBar from "../components/RecipesFilterBar";
import RecipesTable from "../components/RecipesTable";
import { ViewType } from "@/components/ViewSegmentedButton";
import { useGetRecipesQuery } from "@/apis/RecipeApi";
import { useNavigate } from "react-router-dom";

export default function RecipesPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewType>("grid");
  const {
    data,

    isError,
    isLoading,
    isFetching,
  } = useGetRecipesQuery(undefined, {
    refetchOnReconnect: true,
  });

  const recipesTable = useMemo(() => {
    return <RecipesTable data={data ?? []} />;
  }, [data, navigate]);

  const recipesGrid = useMemo(() => {
    return <RecipeGrid recipes={data ?? []} />;
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    // <div>hi</div>
    <CrudListPageLayout>
      <CrudListPageLayout.Header
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
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount itemsEnd={data.length} itemsStart={1} totalItems={data.length} itemDescription="recipes" searchTermUse="recipes" />}
        contentComponent={<CrudListPageLayout.Body.Content>{view === "grid" ? recipesGrid : recipesTable}</CrudListPageLayout.Body.Content>}
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
            onChange={(view) => {
              setView(view);
            }}
          />
        }
      />

      <CrudListPageLayout.Footer
        paginationComponent={
          <CrudListPageLayout.Footer.Pagination
            paginationProps={{
              numPages: Math.ceil(data.length / 10),
              currentPage: 1,
              onPageChange: (pageSelected: number) => {
                console.log(`Page changed to: ${pageSelected}`);
              },
              numberOfPagesToShowOnTruncation: 5,
              showFirstLast: true,
            }}
          />
        }
      />
    </CrudListPageLayout>
  );
}
