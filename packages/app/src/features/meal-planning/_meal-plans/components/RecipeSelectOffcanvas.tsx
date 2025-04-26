import { Button, Offcanvas } from "react-bootstrap";
import { useMealPlanFormActions, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";
import { useRecipesCrudListActions, useRecipesCrudListState } from "../../reducers/RecipesCrudListReducer";

import { FaMagnifyingGlass } from "react-icons/fa6";
import Form from "react-bootstrap/Form";
import Heading from "@/components/Heading";
import PaginationComponent from "@/components/PaginationComponent";
import RecipeFilterDropdown from "./RecipeFilterDropdown";
import RecipeHorizontalCard from "./RecipeHorizontalCard";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import { useSearchRecipesQuery } from "@/apis/RecipeApi";

export default function RecipeSelectOffcanvas() {
  const { recipesQuery } = useRecipesCrudListState();
  const { setSearch, setPage } = useRecipesCrudListActions();

  const { data: results, isLoading } = useSearchRecipesQuery(recipesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { isRecipeOffcanvasVisible } = useMealPlanFormState();
  const { hideRecipeSelectionOffcanvas, selectRecipe } = useMealPlanFormActions();
  const { currentPage, totalItems, numItemEndOnPage, numItemStartOnPage, totalPages } = calculatePaginationElements(recipesQuery.limit ?? 25, results);

  const handleSearch = () => {
    setPage(1); // Reset to the first page when a new search is performed
  };

  return (
    <Offcanvas show={isRecipeOffcanvasVisible} onHide={hideRecipeSelectionOffcanvas} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Select a Recipe</Heading>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bp-recipe_select_offcanvas__body">
        {/* Search Area */}
        <div className="bp-recipe_select_offcanvas__search_area">
          <div className="bp-recipe_select_offcanvas__search_area__input">
            <Form.Control className="bp-recipe_select_offcanvas__search_box" type="text" value={recipesQuery.search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes..." />
            <Button onClick={handleSearch} variant="primary" className="bp-recipe_select_offcanvas__search_button">
              <FaMagnifyingGlass />
              &nbsp;Search recipes
            </Button>
            <RecipeFilterDropdown
              filters={
                <>
                  <div>Filter 1</div>
                  <div>Filter 2</div>
                  <div>Filter 3</div>
                </>
              }
            />
          </div>
        </div>

        {/* Recipe List */}
        {results?.data && (
          <div className="bp-recipe_select_offcanvas__main">
            <ol className="bp-recipe_item_card_list">
              {results.data.map((recipe) => (
                <li key={recipe.id} className="bp-recipe_item_card_list__item">
                  <RecipeHorizontalCard
                    recipe={recipe}
                    onSelect={(recipe) => {
                      selectRecipe(recipe);
                    }}
                  />
                </li>
              ))}
            </ol>
            <PaginationComponent currentPage={currentPage} numPages={totalPages} onPageChange={(page) => setPage(page)} />
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
