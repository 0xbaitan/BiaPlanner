import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import InventoryPage from "./features/_pantry-management/_inventory/pages/InventoryPage";
import LoginPage from "./features/authentication/pages/LoginPage";
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
        <Route path="/pantry/inventory" element={<InventoryPage />} />
      </RoutingTable>
    </Router>
  );
}
