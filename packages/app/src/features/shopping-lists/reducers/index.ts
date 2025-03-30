import { combineReducers } from "@reduxjs/toolkit";
import shoppingListItemsReducer from "./ShoppingListItemsReducer";

const shoppingListsReducer = combineReducers({
  shoppingListItems: shoppingListItemsReducer,
});

export default shoppingListsReducer;
