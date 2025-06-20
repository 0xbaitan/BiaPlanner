import "./styles/SideNavigationBar.scss";

import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { BiSolidCategory, BiSolidFridge } from "react-icons/bi";
import { ElementStyles, Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { FaBook, FaBowlRice, FaGear, FaKitchenSet, FaShop, FaTags } from "react-icons/fa6";
import { GiMeal, GiMilkCarton } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";

import { AiFillProduct } from "react-icons/ai";
import BiaPlannerLogo from "@/icons/bia-planner-logo.svg";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import LogoutButton from "@/features/authentication/components/LogoutButton";
import { PermissionAreaAndKey } from "@biaplanner/shared";
import { RiAccountCircleFill } from "react-icons/ri";
import { RoutePaths } from "@/Routes";
import { useContainsNecessaryPermission } from "@/features/authentication/hooks/useContainsNecessaryPermission";

export default function SideNavigationBar() {
  return (
    <Sidebar
      className="bp-side_navbar"
      width="100%"
      backgroundColor="transparent"
      rootStyles={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div>
        <img
          src={BiaPlannerLogo}
          alt="Bia Planner Logo"
          className="bp-side_navbar__logo"
          style={{
            width: "100%",
            height: "auto",
            padding: "10px",
            marginBottom: "20px",
            display: "block",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </div>
      <Menu
        closeOnClick={true}
        menuItemStyles={{
          button: ({ level, active, isSubmenu, open }) => {
            let styles: ElementStyles = {
              width: "100%",
              height: "100%",

              color: !active ? "#313131" : "#ffffff",
              backgroundColor: !active ? "transparent" : "#0034d1",
              fontSize: "1rem",
              fontWeight: level === 1 ? "bold" : "normal",
              padding: "6px 8px",

              "&:hover": !active
                ? {
                    backgroundColor: "#f0f0f0",
                    color: "#000000",
                  }
                : {
                    backgroundColor: "#002699",
                    color: "#ffffff",
                  },
            };

            if (isSubmenu && active) {
              styles.backgroundColor = "#e6f0ff";
              styles.color = "#0034d1";
            }

            if (open) {
              styles.backgroundColor = "#d9d9d9";
            }

            return styles;
          },
        }}
      >
        <PantryMenu />

        <ShoppingListMenu />
        <MealPlansMenu />
        <ProductCatalogueMenu />
        <RecipeManagementMenu />
        <UserManagementMenu />

        {/* <SettingsMenu /> */}
        <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "2em 1em", marginTop: "1.5em", borderTop: "1px solid #e0e0e0" }}>
          <LogoutButton />
        </div>
      </Menu>
    </Sidebar>
  );
}

function PantryMenu() {
  return (
    <NavigationMenuItem
      label="Pantry"
      path={RoutePaths.PANTRY}
      icon={<BiSolidFridge size={20} className="bp-side_navbar__menu_item_icon" />}
      permissionIndex={{
        area: "pantry",
        key: "viewList",
      }}
    />
  );
}

function MealPlansMenu() {
  return (
    <NavigationMenuItem
      label="Meal Plans"
      path={RoutePaths.MEAL_PLANS}
      icon={<GiMeal size={20} className="bp-side_navbar__menu_item_icon" />}
      permissionIndex={{
        area: "mealPlan",
        key: "viewList",
      }}
    />
  );
}

function ProductCatalogueMenu() {
  return (
    <SubMenu label="Product Catalogue" className="+primary" icon={<AiFillProduct size={20} className="bp-side_navbar__menu_item_icon" />}>
      <NavigationMenuItem
        label="Products"
        path={RoutePaths.PRODUCTS}
        icon={<GiMilkCarton size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "product",
          key: "viewList",
        }}
      />
      <NavigationMenuItem
        label="Brands"
        path={RoutePaths.BRANDS}
        icon={<FaShop size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "brand",
          key: "viewList",
        }}
      />
      <NavigationMenuItem
        label="Product Categories"
        path={RoutePaths.PRODUCT_CATEGORIES}
        icon={<BiSolidCategory size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "productCategory",
          key: "viewList",
        }}
      />
    </SubMenu>
  );
}

function RecipeManagementMenu() {
  return (
    <SubMenu label="Recipe Catalogue" className="+primary" icon={<FaKitchenSet size={20} className="bp-side_navbar__menu_item_icon" />}>
      <NavigationMenuItem
        label="Recipes"
        path={RoutePaths.RECIPES}
        icon={<FaBook size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "recipe",
          key: "viewList",
        }}
      />
      <NavigationMenuItem
        label="Cuisines"
        path={RoutePaths.CUISINES}
        icon={<FaBowlRice size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "cuisine",
          key: "viewList",
        }}
      />
      <NavigationMenuItem
        label="Recipe Tags"
        path={RoutePaths.RECIPE_TAGS}
        icon={<FaTags size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "recipeTag",
          key: "viewList",
        }}
      />
    </SubMenu>
  );
}

function UserManagementMenu() {
  return (
    <SubMenu label="User Management" className="+primary" icon={<FaGear size={20} className="bp-side_navbar__menu_item_icon" />}>
      <NavigationMenuItem
        label="Roles"
        path={RoutePaths.ROLES}
        icon={<FaTags size={20} className="bp-side_navbar__menu_item_icon" />}
        permissionIndex={{
          area: "brand", // Replace with the correct area for roles if applicable
          key: "viewList",
        }}
      />
    </SubMenu>
  );
}

function ShoppingListMenu() {
  return (
    <NavigationMenuItem
      label="Shopping Lists"
      path={RoutePaths.SHOPPING_LISTS}
      icon={<FaShoppingCart size={20} className="bp-side_navbar__menu_item_icon" />}
      permissionIndex={{
        area: "shoppingList",
        key: "viewList",
      }}
    />
  );
}

function SettingsMenu() {
  return (
    <SubMenu label="Settings" className="+primary" icon={<FaGear size={20} className="bp-side_navbar__menu_item_icon" />}>
      <NavigationMenuItem label="Account" path={RoutePaths.SETTINGS_ACCOUNT} icon={<RiAccountCircleFill size={20} className="bp-side_navbar__menu_item_icon" />} />
      <NavigationMenuItem label="Notifications" path={RoutePaths.SETTINGS_NOTIFICATIONS} icon={<IoMdNotifications size={20} className="bp-side_navbar__menu_item_icon" />} />
    </SubMenu>
  );
}

type NavigationMenuItemProps = {
  label: string;
  path: RoutePaths;
  icon?: React.ReactNode;
  permissionIndex?: PermissionAreaAndKey[] | PermissionAreaAndKey;
};
function NavigationMenuItem(props: NavigationMenuItemProps) {
  const { label, path, icon, permissionIndex } = props;
  const { pathname } = useLocation();
  const isActive = pathname === path;
  const navigate = useNavigate();

  return (
    <AuthorisationSieve permissionIndex={permissionIndex} type={AuthorisationSieveType.NULLIFY}>
      <MenuItem className={`bp-side_navbar__menu_item ${isActive ? "+active" : ""}`} icon={icon} onClick={() => navigate(path)} active={isActive}>
        {label}
      </MenuItem>
    </AuthorisationSieve>
  );
}
