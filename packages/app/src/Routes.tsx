import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import AddPantryItemManuallyPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemManuallyPage";
import AddPantryItemPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemPage";
import AddProductPage from "./features/admin/_products/pages/AddProductPage";
import AdminPagesContainer from "./features/admin/components/AdminPagesContainer";
import AdminProductCategoriesPage from "./features/admin/_product-categories/pages/AdminProductCategoriesPage";
import AdminProductsPage from "./features/admin/_products/pages/AdminProductsPage";
import HomePage from "@/pages/HomePage";
import InventoryPage from "./features/pantry-management/_inventory/pages/InventoryPage";
import LoginPage from "./features/authentication/pages/LoginPage";
import PantryInventoryPagesContainer from "./features/pantry-management/components/PantryInventoryPagesContainer";
import Protected from "./features/authentication/components/Protected";
import React from "react";
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
          <Route path="inventory/add-item/manual" element={<AddPantryItemManuallyPage />} />
        </Route>

        <Route path="/admin" element={<AdminPagesContainer />}>
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="product-categories" element={<AdminProductCategoriesPage />} />
          <Route path="products/add-product" element={<AddProductPage />} />
        </Route>
      </RoutingTable>
    </Router>
  );
}
