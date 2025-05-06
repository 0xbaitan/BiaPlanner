import "../styles/RecipeSelectOffcanvas.scss";

import { Button, Offcanvas } from "react-bootstrap";
import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../reducers/RecipesCrudListReducer";

import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import { IRecipe } from "@biaplanner/shared";
import NoResultsFound from "@/components/NoResultsFound";
import PaginationComponent from "@/components/PaginationComponent";
import RecipeHorizontalCard from "./RecipeHorizontalCard";
import RecipesFilterBar from "@/features/recipe-management/_recipes/components/RecipesFilterBar";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useCallback } from "react";
import { useSearchRecipesQuery } from "@/apis/RecipeApi";

export type RecipeSelectOffcanvasProps = {
  onSelect: (recipe: IRecipe) => void;
};

export default function RecipeSelectOffcanvas(props: RecipeSelectOffcanvasProps) {
  const { onSelect } = props;
  const { recipesQuery } = useRecipesCrudListState();
  const { setSearch, setPage, setLimit } = useRecipesCrudListActions();

  const { data: results, isLoading } = useSearchRecipesQuery(recipesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { isRecipeOffcanvasVisible } = useMealPlanFormState();
  const { hideRecipeSelectionOffcanvas, selectRecipe } = useMealPlanFormActions();
  const { selectRecipe: selectRecipeForIngredients } = useMealPlanFormActions();
  const {
    recipesQuery: { limit },
  } = useRecipesCrudListState();
  const { currentPage, totalItems, numItemEndOnPage, numItemStartOnPage, totalPages } = calculatePaginationElements(recipesQuery.limit ?? 25, results);

  const handleSearch = () => {
    setPage(1); // Reset to the first page when a new search is performed
  };

  const handleSelectRecipe = useCallback(
    (recipe: IRecipe) => {
      selectRecipe(recipe);
      selectRecipeForIngredients(recipe);
      onSelect(recipe);
    },
    [onSelect, selectRecipe, selectRecipeForIngredients]
  );

  return (
    <Offcanvas show={isRecipeOffcanvasVisible} onHide={hideRecipeSelectionOffcanvas} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Select a Recipe</Heading>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bp-recipe_select_offcanvas__body">
        {/* Search and Filters */}
        <div className="bp-recipe_select_offcanvas__controls">
          <div className="bp-recipe_select_offcanvas__search_area">
            <Form.Control className="bp-recipe_select_offcanvas__search_box" type="text" value={recipesQuery.search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes..." />
            <Button onClick={handleSearch} variant="primary" className="bp-recipe_select_offcanvas__search_button">
              <FaMagnifyingGlass />
              &nbsp;Search
            </Button>
          </div>
        </div>
        <div className="bp-recipe_select_offcanvas__filters">
          <RecipesFilterBar />
        </div>
        <div className="bp-recipe_select_offcanvas__results">
          <CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} searchTermUsed={recipesQuery.search} />
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(limit)}
            onChange={(limit) => {
              setLimit(limit);
            }}
          />
        </div>
        <hr />
        {/* Recipe List */}
        {results?.data && (
          <div className="bp-recipe_select_offcanvas__main">
            <ol className="bp-recipe_item_card_list">
              {isLoading && <div className="bp-recipe_select_offcanvas__loading">Loading...</div>}
              {!isLoading && results.data.length === 0 && (
                <div className="bp-recipe_select_offcanvas__no_results">
                  <NoResultsFound title="No Recipes Found" description="Try adjusting your filters or search terms." />
                </div>
              )}
              {results.data.map((recipe) => (
                <li key={recipe.id} className="bp-recipe_item_card_list__item">
                  <RecipeHorizontalCard recipe={recipe} onSelect={handleSelectRecipe} />
                </li>
              ))}
            </ol>

            <PaginationComponent className="bp-recipe_select_offcanvas__pagination" currentPage={currentPage} numPages={totalPages} onPageChange={(page) => setPage(page)} />
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
