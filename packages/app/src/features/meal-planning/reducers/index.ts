import { combineReducers } from "@reduxjs/toolkit";
import concreteRecipesCrudList from "./ConcreteRecipesCrudListReducer";
import ingredientManagementReducer from "./IngredientManagementReducer";
import mealPlanFormReducer from "./MealPlanFormReducer";
import recipeFormReducer from "./RecipeFormReducer";
import recipesCrudList from "./RecipesCrudListReducer";
const mealPlanningReducer = combineReducers({
  mealPlanForm: mealPlanFormReducer,
  ingredientManagement: ingredientManagementReducer,
  recipeForm: recipeFormReducer,
  recipesCrudList: recipesCrudList,
  concreteRecipesCrudList: concreteRecipesCrudList,
});

export default mealPlanningReducer;
