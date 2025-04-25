import "../styles/ProductFilterBar.scss";

import { IBrand, IProductCategory, ProductSortBy } from "@biaplanner/shared";
import { useProductsCrudListActions, useProductsCrudListState } from "../reducers/ProductsCrudListReducer";

import FilterBar from "@/components/forms/FilterBar";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useMemo } from "react";

export default function ProductsFilterBar() {
  const { resetFilters } = useProductsCrudListActions();

  return (
    <FilterBar
      prominentFiltersGroup={
        <FilterBar.Group type="prominent-filters">
          <BrandProminentMultiselect />
          <CategoryProminentMultiselect />
        </FilterBar.Group>
      }
      hiddenFiltersGroup={
        <FilterBar.Group type="hidden-filters">
          <div className="bp-product_filter_bar__hidden-filters">
            <FilterBar.Checkbox label="Non-expirable products" />
            <FilterBar.Checkbox label="Loose products" />
          </div>
        </FilterBar.Group>
      }
      sorterGroup={
        <FilterBar.Group type="sorter">
          <ProductSorter />
        </FilterBar.Group>
      }
      showResetButton={true}
      onResetFilters={() => resetFilters()}
    />
  );
}

function ProductSorter() {
  const {
    productsQuery: { sortBy },
  } = useProductsCrudListState();
  const { setSortBy } = useProductsCrudListActions();

  return (
    <FilterBar.Sorter
      value={sortBy}
      onChange={(e) => {
        const value = (e.target as HTMLSelectElement).value;
        setSortBy(value as ProductSortBy);
      }}
    >
      <option value={ProductSortBy.DEFAULT}>Default</option>
      <option value={ProductSortBy.PRODUCT_NAME_A_TO_Z}>Product name (A to Z)</option>
      <option value={ProductSortBy.PRODUCT_NAME_Z_TO_A}>Product name (Z to A)</option>
      <option value={ProductSortBy.PRODUCT_MOST_PANTRY_ITEMS}>Most pantry items</option>
      <option value={ProductSortBy.PRODUCT_LEAST_PANTRY_ITEMS}>Least pantry items</option>
      <option value={ProductSortBy.PRODUCT_MOST_SHOPPING_ITEMS}>Most shopping items</option>
      <option value={ProductSortBy.PRODUCT_LEAST_SHOPPING_ITEMS}>Least shopping items</option>
    </FilterBar.Sorter>
  );
}

function BrandProminentMultiselect() {
  const { data, isError, isLoading } = useGetBrandsQuery();
  const {
    productsQuery: { brandIds },
  } = useProductsCrudListState();
  const { setFilter } = useProductsCrudListActions();

  const mappedBrands = useMemo(() => {
    return (brandIds ?? [])
      .map((brandId) => {
        const found = data?.find((item) => item.id === brandId);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
      .filter(Boolean) as IBrand[];
  }, [brandIds, data]);

  if (!data || isError || isLoading) {
    return <div>Failed to fetch brands</div>;
  }

  return (
    <FilterBar.FilterSelect
      selectLabel="Brands"
      list={data ?? []}
      selectedValues={mappedBrands}
      onChange={(selectedList) => {
        const selectedBrands = selectedList.map((item) => item.id);
        setFilter({ brandIds: selectedBrands });
      }}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
      loading={isLoading}
      disabled={isLoading || isError || !data?.length}
      noDataLabel="No brands available"
    />
  );
}

function CategoryProminentMultiselect() {
  const { data, isError, isLoading } = useGetProductCategoriesQuery();
  const {
    productsQuery: { productCategoryIds },
  } = useProductsCrudListState();
  const { setFilter } = useProductsCrudListActions();

  const mappedCategories = useMemo(() => {
    return (productCategoryIds ?? [])
      .map((categoryId) => {
        const found = data?.find((item) => item.id === categoryId);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
      .filter(Boolean) as IProductCategory[];
  }, [productCategoryIds, data]);

  if (!data || isError || isLoading) {
    return <div>Failed to fetch categories</div>;
  }

  return (
    <FilterBar.FilterSelect
      selectLabel="Categories"
      list={data ?? []}
      selectedValues={mappedCategories}
      onChange={(selectedList) => {
        const selectedCategories = selectedList.map((item) => item.id);
        setFilter({ productCategoryIds: selectedCategories });
      }}
      idSelector={(item) => item.id}
      nameSelector={(item) => item.name}
      loading={isLoading}
      disabled={isLoading || isError || !data?.length}
      noDataLabel="No categories available"
    />
  );
}
