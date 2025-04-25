import { combineReducers } from "@reduxjs/toolkit";
import pantryItemsCrudListReducer from "./PantryItemsCrudListReducer";

const pantryReducer = combineReducers({
  pantryItemsCrudList: pantryItemsCrudListReducer,
});

export default pantryReducer;
