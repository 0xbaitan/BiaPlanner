import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import AddPantryItemManuallyPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemManuallyPage";
import AddPantryItemPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemPage";
import AddProductPage from "./features/admin/_products/pages/AddProductPage";
import AdminBrandsPage from "./features/admin/_brands/pages/AdminBrandsPage";
import AdminCreateBrandPage from "./features/admin/_brands/pages/AdminCreateBrandPage";
import AdminCreateCuisinePage from "./features/admin/_cuisines/pages/AdminCreateCuisinePage";
import AdminCreateProductCategoryPage from "./features/admin/_product-categories/pages/AdminCreateProductCategoryPage";
import AdminCreateRecipeTagPage from "./features/admin/_recipe-tags/pages/AdminCreateRecipeTagPage";
import AdminCuisinesPage from "./features/admin/_cuisines/pages/AdminCuisinesPage";
import AdminPagesContainer from "./features/admin/components/AdminPagesContainer";
import AdminProductCategoriesPage from "./features/admin/_product-categories/pages/AdminProductCategoriesPage";
import AdminProductsPage from "./features/admin/_products/pages/AdminProductsPage";
import AdminRecipeTagsPage from "./features/admin/_recipe-tags/pages/AdminRecipeTagsPage";
import AdminUpdateBrandPage from "./features/admin/_brands/pages/AdminUpdateBrandPage";
import AdminUpdateCuisinePage from "./features/admin/_cuisines/pages/AdminUpdateCuisinePage";
import AdminUpdateProductCategoryPage from "./features/admin/_product-categories/pages/AdminUpdateProductCategoryPage";
import AdminUpdateRecipeTagPage from "./features/admin/_recipe-tags/pages/AdminUpdateRecipeTagPage";
import AuthenticationPagesContainer from "./features/authentication/components/AuthenticationPagesContainer";
import CreateMealPlanPage from "./features/meal-planning/_meal-plans/pages/CreateMealPlanPage";
import CreateRecipePage from "./features/meal-planning/_recipes/pages/CreateRecipePage";
import CreateShoppingListPage from "./features/shopping-lists/pages/CreateShoppingListPage";
import EditRecipePage from "./features/meal-planning/_recipes/pages/EditRecipePage";
import HomePage from "@/pages/HomePage";
import LoginPage from "./features/authentication/pages/LoginPage";
import MarkShoppingDonePage from "./features/shopping-lists/pages/MarkShoppingDonePage";
import MealPlanningPagesContainer from "./features/meal-planning/components/MealPlanningPagesContainer";
import MealPlansPage from "./features/meal-planning/_meal-plans/pages/MealPlansPage";
import PantryInventoryPagesContainer from "./features/pantry-management/components/PantryInventoryPagesContainer";
import PantryPage from "./features/pantry-management/_inventory/pages/PantryPage";
import RecipesListPage from "./features/meal-planning/_recipes/pages/RecipesListPage";
import SelectRecipePage from "./features/meal-planning/_meal-plans/pages/SelectRecipePage";
import ShoppingListPagesContainer from "./features/shopping-lists/components/ShoppingListPagesContainer";
import ShoppingListsPage from "./features/shopping-lists/pages/ShoppingListsPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";
import UpdateProductPage from "./features/admin/_products/pages/UpdateProductPage";
import ViewRecipePage from "./features/meal-planning/_recipes/pages/ViewRecipePage";

export default function Routes() {
  return (
    <Router>
      <RoutingTable>
        <Route path="/" index element={<HomePage />} />
        <Route path="/auth" element={<AuthenticationPagesContainer />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<SignUpPage />} />
        </Route>

        <Route path="/pantry" element={<PantryInventoryPagesContainer />}>
          <Route path={PantryPage.path} element={<PantryPage />} />
          <Route path="inventory/add-item" element={<AddPantryItemPage />} />
          <Route path="inventory/add-item/manual" element={<AddPantryItemManuallyPage />} />
        </Route>

        <Route path="/admin" element={<AdminPagesContainer />}>
          {/* Brands */}
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="brands/create" element={<AdminCreateBrandPage />} />
          <Route path="brands/update/:id" element={<AdminUpdateBrandPage />} />

          {/* Products */}
          <Route path="products" element={<AdminProductsPage />} />

          <Route path="products/create" element={<AddProductPage />} />
          <Route path="products/update/:id" element={<UpdateProductPage />} />

          {/* Product Categories */}

          <Route path="product-categories" element={<AdminProductCategoriesPage />} />
          <Route path="product-categories/create" element={<AdminCreateProductCategoryPage />} />
          <Route path="product-categories/update/:id" element={<AdminUpdateProductCategoryPage />} />

          {/* Cuisine */}
          <Route path="cuisines" element={<AdminCuisinesPage />} />
          <Route path="cuisines/create" element={<AdminCreateCuisinePage />} />
          <Route path="cuisines/update/:id" element={<AdminUpdateCuisinePage />} />

          {/* Recipe Tags */}
          <Route path="recipe-tags" element={<AdminRecipeTagsPage />} />
          <Route path="recipe-tags/create" element={<AdminCreateRecipeTagPage />} />
          <Route path="recipe-tags/update/:id" element={<AdminUpdateRecipeTagPage />} />
        </Route>

        <Route path="/meal-planning" element={<MealPlanningPagesContainer />}>
          <Route path="recipes" element={<RecipesListPage />} />
          <Route path="recipes/create" element={<CreateRecipePage />} />
          <Route path="recipes/update/:id" element={<EditRecipePage />} />
          <Route path="recipes/view/:id" element={<ViewRecipePage />} />
          <Route path="meal-plans" element={<MealPlansPage />} />
          <Route path="meal-plans/select-recipe" element={<SelectRecipePage />} />
          <Route path="meal-plans/create" element={<CreateMealPlanPage />} />
        </Route>

        <Route path={ShoppingListPagesContainer.path} element={<ShoppingListPagesContainer />}>
          <Route path={ShoppingListsPage.relativeToContainerPath} element={<ShoppingListsPage />} />
          <Route path={CreateShoppingListPage.relativeToContainerPath} element={<CreateShoppingListPage />} />
          <Route path={MarkShoppingDonePage.relativeToContainerPath} element={<MarkShoppingDonePage />} />
        </Route>
      </RoutingTable>
    </Router>
  );
}
