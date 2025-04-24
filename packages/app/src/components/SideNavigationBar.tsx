import "./styles/SideNavigationBar.scss";

import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Sidebar, SubMenu, menuClasses } from "react-pro-sidebar";

import LogoutButton from "@/features/authentication/components/LogoutButton";
import PantryPage from "@/features/pantry-management/_inventory/pages/PantryPage";
import { RoutePaths } from "@/Routes";
import ShoppingListsPage from "@/features/shopping-lists/pages/ShoppingListsPage";

export default function SideNavigationBar() {
  return (
    <Sidebar
      className="bp-sidenavigationbar"
      width="100%"
      backgroundColor="transparent"
      rootStyles={{
        display: "flex",
        flexDirection: "column",

        height: "100%",
        [`.${menuClasses.label}`]: {
          color: "black",
        },
      }}
    >
      <Menu
        menuItemStyles={{
          button: ({ level }) => {
            if (level === 0) {
              return {
                color: "black",
              };
            }
          },
        }}
      >
        <PantryMenu />
        <ShoppingListMenu />
        <MealPlansMenu />
        <ProductCatalogueMenu />
        <RecipeManagementMenu />

        <SettingsMenu />
        <MenuItem>
          <LogoutButton />
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

function ProductCatalogueMenu() {
  const navigate = useNavigate();
  return (
    <SubMenu label="Product Catalogue" className="+primary">
      <MenuItem onClick={() => navigate(RoutePaths.PRODUCTS)}>Products</MenuItem>
      <MenuItem onClick={() => navigate(RoutePaths.BRANDS)}>Brands</MenuItem>
      <MenuItem onClick={() => navigate(RoutePaths.PRODUCT_CATEGORIES)}>Product Categories</MenuItem>
    </SubMenu>
  );
}

function SettingsMenu() {
  const navigate = useNavigate();
  return (
    <SubMenu label="Settings" className="+primary">
      <MenuItem onClick={() => navigate(RoutePaths.SETTINGS_ACCOUNT)}>Account</MenuItem>
      <MenuItem onClick={() => navigate(RoutePaths.SETTINGS_NOTIFICATIONS)}>Notifications</MenuItem>
    </SubMenu>
  );
}

function PantryMenu() {
  const navigate = useNavigate();
  return (
    <MenuItem className="+primary" onClick={() => navigate(RoutePaths.PANTRY)}>
      Pantry
    </MenuItem>
  );
}

function MealPlansMenu() {
  const navigate = useNavigate();

  return (
    <MenuItem className="+primary" onClick={() => navigate(RoutePaths.MEAL_PLANS)}>
      Meal Plans
    </MenuItem>
  );
}

function RecipeManagementMenu() {
  const navigate = useNavigate();

  return (
    <SubMenu label="Recipe Catalogue" className="+primary">
      <MenuItem onClick={() => navigate(RoutePaths.RECIPES)}>Recipes</MenuItem>
      <MenuItem onClick={() => navigate(RoutePaths.CUISINES)}>Cuisines</MenuItem>
      <MenuItem onClick={() => navigate(RoutePaths.RECIPE_TAGS)}>Recipe Tags</MenuItem>
    </SubMenu>
  );
}

function ShoppingListMenu() {
  const navigate = useNavigate();

  return (
    <MenuItem className="+primary" onClick={() => navigate(RoutePaths.SHOPPING_LISTS)}>
      Shopping Lists
    </MenuItem>
  );
}
