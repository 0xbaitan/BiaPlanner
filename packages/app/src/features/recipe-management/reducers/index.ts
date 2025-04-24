import { combineReducers } from "@reduxjs/toolkit";
import cuisinesCrudListReducer from "../_cuisines/reducers/CuisinesCrudListReducer";
import recipeTagsCrudListReducer from "../_recipe-tags/reducers/RecipeTagsCrudListReducer";
const recipeCatalogueReducer = combineReducers({
  recipeTagsCrudList: recipeTagsCrudListReducer,
  cuisinesCrudList: cuisinesCrudListReducer,
});
export default recipeCatalogueReducer;
