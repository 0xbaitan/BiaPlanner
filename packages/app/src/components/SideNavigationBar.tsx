import { Menu, MenuItem, Sidebar, SubMenu, menuClasses, sidebarClasses } from "react-pro-sidebar";

import { Link } from "react-router-dom";
import LogoutButton from "@/features/authentication/components/LogoutButton";

export default function SideNavigationBar() {
  return (
    <Sidebar
      width="100%"
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
        <SubMenu title="Pantry" label="Pantry" className="+primary">
          <MenuItem>
            <Link to={"/pantry/inventory"}>Inventory</Link>
          </MenuItem>
          <MenuItem>Shopping List</MenuItem>
          <MenuItem>Ingredients Catalogue</MenuItem>
        </SubMenu>
        <SubMenu title="Meal Planning" label="Meal Planning" className="+primary">
          <MenuItem>Meal Plans</MenuItem>
          <MenuItem>Recipes</MenuItem>
        </SubMenu>
        <SubMenu title="Admin" label="Admin" className="+primary">
          <MenuItem>
            <Link to={"/admin/products"}>Products</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/admin/product-categories"}>Product Categories</Link>
          </MenuItem>
        </SubMenu>
        <MenuItem>Community </MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>
          <LogoutButton />
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
