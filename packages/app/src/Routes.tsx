import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import AddPantryItemPage from "./features/pantry-management/_inventory/_add-pantry-item/pages/AddPantryItemPage";
import AddProductPage from "./features/admin/_products/pages/AddProductPage";
import AdminBrandsPage from "./features/admin/_brands/pages/AdminBrandsPage";
import AdminCreateBrandPage from "./features/admin/_brands/pages/AdminCreateBrandPage";
import AdminCreateCuisinePage from "./features/recipe-management/_cuisines/pages/AdminCreateCuisinePage";
import AdminCreateProductCategoryPage from "./features/admin/_product-categories/pages/AdminCreateProductCategoryPage";
import AdminCreateRecipeTagPage from "./features/recipe-management/_recipe-tags/pages/AdminCreateRecipeTagPage";
import AdminCuisinesPage from "./features/recipe-management/_cuisines/pages/AdminCuisinesPage";
import AdminProductCategoriesPage from "./features/admin/_product-categories/pages/AdminProductCategoriesPage";
import AdminProductsPage from "./features/admin/_products/pages/AdminProductsPage";
import AdminUpdateBrandPage from "./features/admin/_brands/pages/AdminUpdateBrandPage";
import AdminUpdateCuisinePage from "./features/recipe-management/_cuisines/pages/AdminUpdateCuisinePage";
import AdminUpdateProductCategoryPage from "./features/admin/_product-categories/pages/AdminUpdateProductCategoryPage";
import AdminUpdateRecipeTagPage from "./features/recipe-management/_recipe-tags/pages/AdminUpdateRecipeTagPage";
import CreateMealPlanPage from "./features/meal-planning/_meal-plans/pages/CreateMealPlanPage";
import CreateRecipePage from "./features/recipe-management/_recipes/pages/CreateRecipePage";
import CreateShoppingListPage from "./features/shopping-lists/pages/CreateShoppingListPage";
import EditRecipePage from "./features/recipe-management/_recipes/pages/EditRecipePage";
import LoginPage from "./features/authentication/pages/LoginPage";
import MarkShoppingDonePage from "./features/shopping-lists/pages/MarkShoppingDonePage";
import MealPlansPage from "./features/meal-planning/_meal-plans/pages/MealPlansPage";
import PantryPage from "./features/pantry-management/_inventory/pages/PantryPage";
import ProtectedPagesContainer from "./components/layouts/ProtectedPagesContainer";
import PublicPagesContainer from "./components/layouts/PublicPagesContainer";
import RecipeTagsPage from "./features/recipe-management/_recipe-tags/pages/RecipeTagsPage";
import RecipesListPage from "./features/recipe-management/_recipes/pages/RecipesListPage";
import SelectRecipePage from "./features/meal-planning/_meal-plans/pages/SelectRecipePage";
import ShoppingListsPage from "./features/shopping-lists/pages/ShoppingListsPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";
import UpdateProductPage from "./features/admin/_products/pages/UpdateProductPage";
import ViewRecipePage from "./features/recipe-management/_recipes/pages/ViewRecipePage";

export enum RoutePaths {
  PANTRY = "/pantry",
  PANTRY_VIEW_ITEM = "/pantry/view-item/:id",
  PANTRY_ADD_ITEM = "/pantry/add-item",

  PANTRY_EDIT_ITEM = "/pantry/edit-item/:id",

  MEAL_PLANS = "/meal-plans",
  MEAL_PLANS_CREATE = "/meal-plans/create",
  MEAL_PLANS_SELECT_RECIPE = "/meal-plans/select-recipe",
  MEAL_PLANS_VIEW = "/meal-plans/view/:id",
  MEAL_PLANS_EDIT = "/meal-plans/edit/:id",

  RECIPES = "/recipe-catalogue/recipes",
  RECIPES_CREATE = "/recipe-catalogue/recipes/create",
  RECIPES_VIEW = "/recipe-catalogue/recipes/view/:id",
  RECIPES_EDIT = "/recipe-catalogue/recipes/edit/:id",

  CUISINES = "/recipe-catalogue/cuisines",
  CUISINES_CREATE = "/recipe-catalogue/cuisines/create",
  CUISINES_VIEW = "/recipe-catalogue/cuisines/view/:id",
  CUISINES_EDIT = "/recipe-catalogue/cuisines/edit/:id",

  RECIPE_TAGS = "/recipe-catalogue/recipe-tags",
  RECIPE_TAGS_CREATE = "/recipe-catalogue/recipe-tags/create",
  RECIPE_TAGS_VIEW = "/recipe-catalogue/recipe-tags/view/:id",
  RECIPE_TAGS_EDIT = "/recipe-catalogue/recipe-tags/edit/:id",

  SHOPPING_LISTS = "/shopping-lists",
  SHOPPING_LISTS_CREATE = "/shopping-lists/create",
  SHOPPING_LISTS_VIEW = "/shopping-lists/view/:id",
  SHOPPING_LISTS_EDIT = "/shopping-lists/edit/:id",
  SHOPPING_LISTS_MARK_DONE = "/shopping-lists/mark-done/:id",

  PRODUCTS = "/product-catalogue/products",
  PRODUCTS_CREATE = "/product-catalogue/products/create",
  PRODUCTS_VIEW = "/product-catalogue/products/view/:id",
  PRODUCTS_EDIT = "/product-catalogue/products/edit/:id",

  BRANDS = "/product-catalogue/brands",
  BRANDS_CREATE = "/product-catalogue/brands/create",
  BRANDS_VIEW = "/product-catalogue/brands/view/:id",
  BRANDS_EDIT = "/product-catalogue/brands/edit/:id",

  PRODUCT_CATEGORIES = "/product-catalogue/product-categories",
  PRODUCT_CATEGORIES_CREATE = "/product-catalogue/product-categories/create",
  PRODUCT_CATEGORIES_VIEW = "/product-catalogue/product-categories/view/:id",
  PRODUCT_CATEGORIES_EDIT = "/product-catalogue/product-categories/edit/:id",

  SETTINGS_ACCOUNT = "/settings/account",
  SETTINGS_NOTIFICATIONS = "/settings/notifications",

  SIGNUP = "/signup",
  LOGIN = "/login",
}

export function fillParametersInPath(path: RoutePaths, params: Record<string, string | number>) {
  return Object.entries(params).reduce<string>((acc, [key, value]) => {
    return acc.replace(`:${key}`, String(value));
  }, path as string);
}

export default function Routes() {
  return (
    <Router>
      <RoutingTable>
        <Route path="" element={<ProtectedPagesContainer />}>
          <Route path={RoutePaths.PANTRY} element={<PantryPage />} />
          <Route path={RoutePaths.PANTRY_VIEW_ITEM} element={<PantryPage />} />
          <Route path={RoutePaths.PANTRY_ADD_ITEM} element={<AddPantryItemPage />} />
          <Route path={RoutePaths.PANTRY_EDIT_ITEM} element={<AddPantryItemPage />} />

          <Route path={RoutePaths.MEAL_PLANS} element={<MealPlansPage />} />
          <Route path={RoutePaths.MEAL_PLANS_CREATE} element={<CreateMealPlanPage />} />
          <Route path={RoutePaths.MEAL_PLANS_SELECT_RECIPE} element={<SelectRecipePage />} />
          <Route path={RoutePaths.MEAL_PLANS_VIEW} element={<ViewRecipePage />} />
          <Route path={RoutePaths.MEAL_PLANS_EDIT} element={<EditRecipePage />} />
          <Route path={RoutePaths.RECIPES} element={<RecipesListPage />} />
          <Route path={RoutePaths.RECIPES_CREATE} element={<CreateRecipePage />} />
          <Route path={RoutePaths.RECIPES_VIEW} element={<ViewRecipePage />} />
          <Route path={RoutePaths.RECIPES_EDIT} element={<EditRecipePage />} />

          <Route path={RoutePaths.CUISINES} element={<AdminCuisinesPage />} />
          <Route path={RoutePaths.CUISINES_CREATE} element={<AdminCreateCuisinePage />} />
          <Route path={RoutePaths.CUISINES_VIEW} element={<AdminCuisinesPage />} />

          <Route path={RoutePaths.CUISINES_EDIT} element={<AdminUpdateCuisinePage />} />

          <Route path={RoutePaths.RECIPE_TAGS} element={<RecipeTagsPage />} />
          <Route path={RoutePaths.RECIPE_TAGS_CREATE} element={<AdminCreateRecipeTagPage />} />
          <Route path={RoutePaths.RECIPE_TAGS_VIEW} element={<RecipeTagsPage />} />
          <Route path={RoutePaths.RECIPE_TAGS_EDIT} element={<AdminUpdateRecipeTagPage />} />
          <Route path={RoutePaths.SHOPPING_LISTS} element={<ShoppingListsPage />} />

          <Route path={RoutePaths.SHOPPING_LISTS_CREATE} element={<CreateShoppingListPage />} />
          <Route path={RoutePaths.SHOPPING_LISTS_VIEW} element={<ShoppingListsPage />} />
          <Route path={RoutePaths.SHOPPING_LISTS_EDIT} element={<ShoppingListsPage />} />
          <Route path={RoutePaths.SHOPPING_LISTS_MARK_DONE} element={<MarkShoppingDonePage />} />

          <Route path={RoutePaths.PRODUCTS} element={<AdminProductsPage />} />
          <Route path={RoutePaths.PRODUCTS_CREATE} element={<AddProductPage />} />
          <Route path={RoutePaths.PRODUCTS_VIEW} element={<AdminProductsPage />} />
          <Route path={RoutePaths.PRODUCTS_EDIT} element={<UpdateProductPage />} />

          <Route path={RoutePaths.BRANDS} element={<AdminBrandsPage />} />
          <Route path={RoutePaths.BRANDS_CREATE} element={<AdminCreateBrandPage />} />
          <Route path={RoutePaths.BRANDS_VIEW} element={<AdminBrandsPage />} />
          <Route path={RoutePaths.BRANDS_EDIT} element={<AdminUpdateBrandPage />} />

          <Route path={RoutePaths.PRODUCT_CATEGORIES} element={<AdminProductCategoriesPage />} />
          <Route path={RoutePaths.PRODUCT_CATEGORIES_CREATE} element={<AdminCreateProductCategoryPage />} />
          <Route path={RoutePaths.PRODUCT_CATEGORIES_VIEW} element={<AdminProductCategoriesPage />} />
          <Route path={RoutePaths.PRODUCT_CATEGORIES_EDIT} element={<AdminUpdateProductCategoryPage />} />

          <Route path={RoutePaths.SETTINGS_ACCOUNT} element={<AdminBrandsPage />} />
          <Route path={RoutePaths.SETTINGS_NOTIFICATIONS} element={<AdminBrandsPage />} />
        </Route>

        <Route path="" element={<PublicPagesContainer />}>
          <Route path={RoutePaths.SIGNUP} element={<SignUpPage />} />
          <Route path={RoutePaths.LOGIN} element={<LoginPage />} />
        </Route>
      </RoutingTable>
    </Router>
  );
}
