import { combineReducers } from "@reduxjs/toolkit";
import mealPlanFormReducer from "./MealPlanFormReducer";

const mealPlanningReducer = combineReducers({
  mealPlanForm: mealPlanFormReducer,
});

export default mealPlanningReducer;
