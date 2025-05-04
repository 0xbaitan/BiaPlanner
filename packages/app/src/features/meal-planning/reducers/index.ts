import { combineReducers } from "@reduxjs/toolkit";
import concreteRecipesCrudList from "./ConcreteRecipesCrudListReducer";
import mealPlanFormReducer from "./MealPlanFormReducer";
import recipeFormReducer from "./RecipeFormReducer";
import recipesCrudList from "./RecipesCrudListReducer";

const mealPlanningReducer = combineReducers({
  mealPlanForm: mealPlanFormReducer,

  recipeForm: recipeFormReducer,
  recipesCrudList: recipesCrudList,
  concreteRecipesCrudList: concreteRecipesCrudList,
});

export default mealPlanningReducer;
