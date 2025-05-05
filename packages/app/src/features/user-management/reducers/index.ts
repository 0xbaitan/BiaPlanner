import { combineReducers } from "@reduxjs/toolkit";
import rolesCrudListReducer from "../_roles/reducers/RolesCrudListReducer";

const userManagementReducer = combineReducers({
  rolesCrudList: rolesCrudListReducer,
});
export default userManagementReducer;
