import { ExpiredItemsVisibility, IBrand, IProduct, PantryItemSortBy } from "@biaplanner/shared";
import { usePantryItemsCrudListActions, usePantryItemsCrudListState } from "../reducers/PantryItemsCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useGetProductsQuery } from "@/apis/ProductsApi";
import { useMemo } from "react";

export default function PantryItemsFilterBar() {
  const { resetFilters } = usePantryItemsCrudListActions();

  return (
    <FilterBar
      prominentFiltersGroup={
        <FilterBar.Group type="prominent-filters">
          <ExpiredItemsVisibilitySelect />
          <BrandMultiselect />
        </FilterBar.Group>
      }
      hiddenFiltersGroup={
        <FilterBar.Group type="hidden-filters">
          <div className="bp-pantry_item_filter_bar__hidden-filters">
            <LooseItemsCheckbox />
            <ProductFilter />
            <ProductCategoryFilter />
          </div>
        </FilterBar.Group>
      }
      sorterGroup={
        <FilterBar.Group type="sorter">
          <PantryItemSorter />
        </FilterBar.Group>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}

function PantryItemSorter() {
  const {
    pantryItemsQuery: { sortBy },
  } = usePantryItemsCrudListState();
  const { setSortBy } = usePantryItemsCrudListActions();

  return (
    <FilterBar.Sorter
      value={sortBy}
      onChange={(e) => {
        const value = (e.target as HTMLSelectElement).value;
        setSortBy(value as PantryItemSortBy);
      }}
    >
      <option value={PantryItemSortBy.NEWEST}>Newest</option>
      <option value={PantryItemSortBy.OLDEST}>Oldest</option>
      <option value={PantryItemSortBy.PRODUCT_NAME_A_TO_Z}>Product Name (A to Z)</option>
      <option value={PantryItemSortBy.PRODUCT_NAME_Z_TO_A}>Product Name (Z to A)</option>
      <option value={PantryItemSortBy.NEAREST_TO_EXPIRY}>Nearest to Expiry</option>
      <option value={PantryItemSortBy.FURTHEST_FROM_EXPIRY}>Furthest from Expiry</option>
      <option value={PantryItemSortBy.HIGHEST_QUANTITY}>Highest Quantity</option>
      <option value={PantryItemSortBy.LOWEST_QUANTITY}>Lowest Quantity</option>
    </FilterBar.Sorter>
  );
}

function BrandMultiselect() {
  const { data, isError, isLoading } = useGetBrandsQuery();
  const {
    pantryItemsQuery: { brandIds },
  } = usePantryItemsCrudListState();
  const { setFilter } = usePantryItemsCrudListActions();

  const mappedBrands = useMemo(() => {
    return (brandIds ?? [])
      .map((brandId) => {
        const found = data?.find((item) => item.id === brandId);
        return found || null;
      })
      .filter(Boolean);
  }, [brandIds, data]) as IBrand[];

  if (!data || isError || isLoading) {
    return <div>Failed to fetch brands</div>;
  }

  return (
    <FilterBar.FilterSelect
      selectLabel="Brands"
      list={data ?? []}
      selectedValues={mappedBrands ?? []}
      onChange={(selectedList) => {
        const selectedBrandIds = selectedList.map((item) => item.id);
        setFilter({ brandIds: selectedBrandIds });
      }}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
      loading={isLoading}
      disabled={isLoading || isError || !data?.length}
      noDataLabel="No brands available"
    />
  );
}

function ExpiredItemsVisibilitySelect() {
  const { setFilter } = usePantryItemsCrudListActions();
  const {
    pantryItemsQuery: { expiredItemsVisibility },
  } = usePantryItemsCrudListState();

  return (
    <FilterBar.OrdinarySelect
      label="Expired Items Visibility"
      value={expiredItemsVisibility}
      onChange={(e) => {
        const value = e.target.value as ExpiredItemsVisibility;
        setFilter({ expiredItemsVisibility: value });
      }}
    >
      <option value={ExpiredItemsVisibility.SHOW_ALL}>Show All</option>
      <option value={ExpiredItemsVisibility.SHOW_EXPIRED_ONLY}>Show Expired Only</option>
      <option value={ExpiredItemsVisibility.SHOW_FRESH_ONLY}>Show Fresh Only</option>
    </FilterBar.OrdinarySelect>
  );
}

function LooseItemsCheckbox() {
  const { setFilter } = usePantryItemsCrudListActions();

  const {
    pantryItemsQuery: { showLooseOnly },
  } = usePantryItemsCrudListState();

  return (
    <FilterBar.Checkbox
      label="Show loose items only"
      checked={showLooseOnly}
      onChange={(e) => {
        const value = e.target.checked;
        setFilter({ showLooseOnly: value });
      }}
    />
  );
}

function ProductFilter() {
  const { data: products, isError, isLoading } = useGetProductsQuery();

  const {
    pantryItemsQuery: { productIds },
  } = usePantryItemsCrudListState();

  const { setFilter } = usePantryItemsCrudListActions();

  const mappedProducts = useMemo(() => {
    return (productIds ?? [])
      .map((productId) => {
        const found = products?.find((item) => item.id === productId);
        return found || null;
      })
      .filter(Boolean);
  }, [productIds, products]) as IProduct[];

  if (!products || isError || isLoading) {
    return <div>Failed to fetch products</div>;
  }

  return (
    <FilterBar.FilterSelect
      selectLabel="Products"
      list={products ?? []}
      selectedValues={mappedProducts ?? []}
      onChange={(selectedList) => {
        const selectedProductIds = selectedList.map((item) => item.id);
        setFilter({ productIds: selectedProductIds });
      }}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
      loading={isLoading}
      disabled={isLoading || isError || !products?.length}
      noDataLabel="No products available"
    />
  );
}

function ProductCategoryFilter() {
  const {
    pantryItemsQuery: { productCategoryIds },
  } = usePantryItemsCrudListState();

  const { setFilter } = usePantryItemsCrudListActions();

  return (
    <ProductCategoryMultiselect
      onSelectionChange={(selectedList) => {
        const selectedProductCategoryIds = selectedList.map((item) => item.id);
        setFilter({ productCategoryIds: selectedProductCategoryIds });
      }}
      initialValues={productCategoryIds?.map((id) => ({ id })) ?? []}
    />
  );
}
