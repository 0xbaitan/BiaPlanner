import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import AddPantryItemPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemPage";
import HomePage from "@/pages/HomePage";
import InventoryPage from "./features/pantry-management/_inventory/pages/InventoryPage";
import LoginPage from "./features/authentication/pages/LoginPage";
import PantryInventoryPagesContainer from "./features/pantry-management/components/PantryInventoryPagesContainer";
import Protected from "./features/authentication/components/Protected";
import SignUpPage from "./features/authentication/pages/SignUpPage";

export default function Routes() {
  return (
    <Router>
      <RoutingTable>
        <Route path="/" index element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/login"
          element={
            // <RedirectWhenAuthenticated>
            <LoginPage />
            // </RedirectWhenAuthenticated>
          }
        />

        <Route path="/pantry" element={<PantryInventoryPagesContainer />}>
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/add-item" element={<AddPantryItemPage />} />
        </Route>
      </RoutingTable>
    </Router>
  );
}
