import { combineReducers } from "@reduxjs/toolkit";
import recipeTagsCrudListReducer from "../_recipe-tags/reducers/RecipeTagsCrudListReducer";
const recipeCatalogueReducer = combineReducers({
  recipeTagsCrudList: recipeTagsCrudListReducer,
});
export default recipeCatalogueReducer;
