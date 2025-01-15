import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import AddPantryItemManuallyPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemManuallyPage";
import AddPantryItemPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemPage";
import AddProductPage from "./features/admin/_products/pages/AddProductPage";
import AdminBrandsPage from "./features/admin/_brands/pages/AdminBrandsPage";
import AdminCreateBrandPage from "./features/admin/_brands/pages/AdminCreateBrandPage";
import AdminPagesContainer from "./features/admin/components/AdminPagesContainer";
import AdminProductCategoriesPage from "./features/admin/_product-categories/pages/AdminProductCategoriesPage";
import AdminProductsPage from "./features/admin/_products/pages/AdminProductsPage";
import CreateMealPlanPage from "./features/meal-planning/_meal-plans/pages/CreateMealPlanPage";
import CreateRecipePage from "./features/meal-planning/_recipes/pages/CreateRecipePage";
import HomePage from "@/pages/HomePage";
import InventoryPage from "./features/pantry-management/_inventory/pages/InventoryPage";
import LoginPage from "./features/authentication/pages/LoginPage";
import MealPlanningPagesContainer from "./features/meal-planning/components/MealPlanningPagesContainer";
import MealPlansPage from "./features/meal-planning/_meal-plans/pages/MealPlansPage";
import PantryInventoryPagesContainer from "./features/pantry-management/components/PantryInventoryPagesContainer";
import RecipesPage from "./features/meal-planning/_recipes/pages/RecipesPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";
import UpdateProductPage from "./features/admin/_products/pages/UpdateProductPage";

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
          {/* Brands */}
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="brands/create" element={<AdminCreateBrandPage />} />

          {/* Products */}
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="product-categories" element={<AdminProductCategoriesPage />} />
          <Route path="products/create" element={<AddProductPage />} />
          <Route path="products/update/:id" element={<UpdateProductPage />} />
        </Route>

        <Route path="/meal-planning" element={<MealPlanningPagesContainer />}>
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/create" element={<CreateRecipePage />} />
          <Route path="meal-plans" element={<MealPlansPage />} />
          <Route path="meal-plans/create" element={<CreateMealPlanPage />} />
        </Route>
      </RoutingTable>
    </Router>
  );
}
