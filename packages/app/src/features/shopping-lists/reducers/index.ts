import { combineReducers } from "@reduxjs/toolkit";
import markShoppingDoneReducer from "./MarkShoppingDoneReducer";
import shoppingListItemsReducer from "./ShoppingListItemsReducer";

const shoppingListsReducer = combineReducers({
  shoppingListItems: shoppingListItemsReducer,
  markShoppingDone: markShoppingDoneReducer,
});

export default shoppingListsReducer;
