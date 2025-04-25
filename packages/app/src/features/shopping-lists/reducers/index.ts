import { combineReducers } from "@reduxjs/toolkit";
import markShoppingDoneReducer from "./MarkShoppingDoneReducer";
import shoppingListItemsReducer from "./ShoppingListItemsReducer";
import shoppingListsCrudListReducer from "./ShoppingListsCrudListReducer";
const shoppingListsReducer = combineReducers({
  shoppingListItems: shoppingListItemsReducer,
  markShoppingDone: markShoppingDoneReducer,
  shoppingListsCrudList: shoppingListsCrudListReducer,
});

export default shoppingListsReducer;
