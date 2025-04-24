import "./styles/SideNavigationBar.scss";

import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Sidebar, SubMenu, menuClasses } from "react-pro-sidebar";

import LogoutButton from "@/features/authentication/components/LogoutButton";
import PantryPage from "@/features/pantry-management/_inventory/pages/PantryPage";
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
        <MenuItem>Dashboard</MenuItem>
        <PantryMenu />
        <SubMenu title="Meal Planning" label="Meal Planning" className="+primary">
          <MenuItem>
            <Link to={"/meal-planning/meal-plans"}>Meal Plans</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/meal-planning/recipes"}>Recipes</Link>
          </MenuItem>
        </SubMenu>
        <ShoppingListMenu />
        <SubMenu title="Admin" label="Admin" className="+primary">
          <MenuItem>
            <Link to={"/admin/brands"}>Brands</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/admin/products"}>Products</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/admin/product-categories"}>Product Categories</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/admin/cuisines"}>Cuisines</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/admin/recipe-tags"}>Recipe Tags</Link>
          </MenuItem>
        </SubMenu>

        <SettingsMenu />
        <MenuItem>
          <LogoutButton />
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

function SettingsMenu() {
  const navigate = useNavigate();
  return (
    <SubMenu label="Settings" className="+primary">
      <MenuItem>Account</MenuItem>
      <MenuItem>Privacy</MenuItem>
      <MenuItem>Security</MenuItem>
    </SubMenu>
  );
}

function PantryMenu() {
  const navigate = useNavigate();
  return (
    <MenuItem className="+primary" onClick={() => navigate(PantryPage.path)}>
      Pantry
    </MenuItem>
  );
}

function MealPlansMenu() {
  const navigate = useNavigate();

  return (
    <MenuItem className="+primary" onClick={() => navigate("/meal-planning/meal-plans")}>
      Meal Plans
    </MenuItem>
  );
}

function RecipeManagementMenu() {
  const navigate = useNavigate();

  return (
    <SubMenu label="Recipe Management" className="+primary">
      <MenuItem onClick={() => navigate("/meal-planning/recipes")}>Recipes</MenuItem>
      <MenuItem onClick={() => navigate("/meal-planning/recipe-tags")}>Recipe Tags</MenuItem>
      <MenuItem onClick={() => navigate("/meal-planning/cuisines")}>Cuisines</MenuItem>
    </SubMenu>
  );
}

function ShoppingListMenu() {
  const navigate = useNavigate();

  return (
    <MenuItem className="+primary" onClick={() => navigate(ShoppingListsPage.path)}>
      Shopping Lists
    </MenuItem>
  );
}
