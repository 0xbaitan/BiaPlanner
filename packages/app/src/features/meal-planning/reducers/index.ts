import { combineReducers } from "@reduxjs/toolkit";
import mealPlanFormReducer from "./MealPlanFormReducer";
import recipeFormReducer from "./RecipeFormReducer";

const mealPlanningReducer = combineReducers({
  mealPlanForm: mealPlanFormReducer,
  recipeForm: recipeFormReducer,
});

export default mealPlanningReducer;
