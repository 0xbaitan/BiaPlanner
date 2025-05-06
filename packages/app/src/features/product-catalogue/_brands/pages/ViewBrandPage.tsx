import "../styles/ViewBrandPage.scss";

import AuthorisationSieve, { AuthorisationSieveType } from "@/features/authentication/components/AuthorisationSieve";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useDeleteBrandMutation, useGetBrandQuery } from "@/apis/BrandsApi";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "@/components/Alert";
import Button from "react-bootstrap/Button";
import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import Heading from "@/components/Heading";
import { IBrand } from "@biaplanner/shared";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useGetTopBrandedProductsQuery } from "@/apis/ProductsApi";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

const TOP_BRANDED_PRODUCTS_LIMIT = 10;
export default function ViewBrandPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: brand,
    isLoading,
    isError,
  } = useGetBrandQuery(String(id), {
    refetchOnMountOrArgChange: true,
  });

  const [deleteBrand, { isError: isDeletionFailure, isLoading: isDeletionPending, isSuccess: isDeletionSuccess }] = useDeleteBrandMutation();

  const { data: topBrandedProducts } = useGetTopBrandedProductsQuery(
    {
      brandId: String(brand?.id),
      limit: TOP_BRANDED_PRODUCTS_LIMIT,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !brand?.id,
    }
  );

  const { notify: notifyOnDeletion } = useSimpleStatusToast({
    isError: isDeletionFailure,
    isLoading: isDeletionPending,
    isSuccess: isDeletionSuccess,
    successMessage: "Brand deleted successfully.",
    errorMessage: "Failed to delete brand.",
    loadingMessage: "Deleting brand...",
    idPrefix: "brand-deletion",
    onFailure: () => {
      console.error("Failed to delete brand");
    },
    onSuccess: () => {
      navigate(RoutePaths.BRANDS);
    },
  });

  const { notify: notifyDeletion } = useDeletionToast<IBrand>({
    identifierSelector(item) {
      return item.name;
    },
    onConfirm: async (item) => {
      notifyOnDeletion();
      await deleteBrand(item.id);
    },
  });

  const handleDeleteBrand = useCallback(() => {
    brand && notifyDeletion(brand);
  }, [brand, notifyDeletion]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !brand) return <div>Error loading brand details.</div>;

  return (
    <CrudViewPageLayout
      breadcrumbs={[
        {
          label: "Brands",
          href: RoutePaths.BRANDS,
        },
        {
          label: `${brand.name}`,
          href: fillParametersInPath(RoutePaths.BRANDS_VIEW, { id: brand.id }),
        },
      ]}
      title={brand.name}
      actions={
        <div className="bp-brand_view__actions">
          <AuthorisationSieve
            permissionIndex={{
              area: "brand",
              key: "editItem",
            }}
            type={AuthorisationSieveType.NULLIFY}
          >
            <Button variant="secondary" onClick={() => navigate(fillParametersInPath(RoutePaths.BRANDS_EDIT, { id: brand.id }))}>
              <FaEdit />
              &ensp;Edit brand
            </Button>
          </AuthorisationSieve>
          <AuthorisationSieve
            permissionIndex={{
              area: "product",
              key: "deleteItem",
            }}
            type={AuthorisationSieveType.NULLIFY}
          >
            <Button variant="outline-danger" onClick={handleDeleteBrand}>
              <FaTrash />
              &ensp;Delete brand
            </Button>
          </AuthorisationSieve>
        </div>
      }
    >
      <div className="bp-brand_view__details_container">
        <div className="bp-brand_view__image_container">{brand.logoId ? <img src={getImagePath(brand.logo)} alt={brand.name} className="bp-brand_view__image" /> : <div className="bp-brand_view__image_placeholder">No Logo</div>}</div>
        <div className="bp-brand_view__info_container">
          <Heading level={Heading.Level.H1} className="bp-brand_view__title">
            About the brand
          </Heading>
          <p className="bp-brand_view__description">{brand.description || "No description provided."}</p>
        </div>
      </div>
      <div className="bp-brand_view__products_container">
        <Heading level={Heading.Level.H2} className="bp-brand_view__products_heading">
          Most popular products
        </Heading>
        {topBrandedProducts?.length && topBrandedProducts.length > 0 ? (
          <ol className="bp-brand_view__products_list">
            {brand.products?.map((product) => (
              <li key={product.id} className="bp-brand_view__products_list_item">
                <img src={getImagePath(product.cover)} alt={product.name} className="bp-brand_view__products_list_item_image" />
                <span className="bp-brand_view__products_list_item_name">{product.name}</span>

                <AuthorisationSieve
                  permissionIndex={{
                    area: "product",
                    key: "viewItem",
                  }}
                  type={AuthorisationSieveType.NULLIFY}
                >
                  <Button variant="outline-primary" size="sm" className="bp-brand_view__products_list_item_button" onClick={() => navigate(fillParametersInPath(RoutePaths.PRODUCTS_VIEW, { id: product.id }))}>
                    <FaEye />
                    &ensp;View
                  </Button>
                </AuthorisationSieve>
              </li>
            ))}
          </ol>
        ) : (
          <Alert variant="warning" title="No Products Found" message="This brand does not have any associated products." />
        )}
      </div>
    </CrudViewPageLayout>
  );
}
