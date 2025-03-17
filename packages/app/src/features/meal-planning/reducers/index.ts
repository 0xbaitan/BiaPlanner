import { combineReducers } from "@reduxjs/toolkit";
import ingredientManagementReducer from "./IngredientManagementReducer";
import mealPlanFormReducer from "./MealPlanFormReducer";
import recipeFormReducer from "./RecipeFormReducer";

const mealPlanningReducer = combineReducers({
  mealPlanForm: mealPlanFormReducer,
  ingredientManagement: ingredientManagementReducer,
  recipeForm: recipeFormReducer,
});

export default mealPlanningReducer;
