import "../styles/RecipeFilterDropdown.scss";

import DropdownPane from "@/components/DropdownPane";
import { IoFilter } from "react-icons/io5";

export type RecipeFilterDropdownProps = {
  filters: React.ReactNode; // Filters to display in the dropdown
};

export default function RecipeFilterDropdown({ filters }: RecipeFilterDropdownProps) {
  return (
    <DropdownPane toggleId="recipe-filters" toggleText="Filter recipes" contentProps={{ className: "bp-recipe_filter_dropdown__content" }}>
      {filters}
    </DropdownPane>
  );
}
