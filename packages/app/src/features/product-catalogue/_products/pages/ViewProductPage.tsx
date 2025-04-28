import "../styles/ViewProductPage.scss";

import { FaEdit, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useDeleteProductMutation, useGetProductByIdQuery } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import Heading from "@/components/Heading";
import { IProduct } from "@biaplanner/shared";
import { getImagePath } from "@/util/imageFunctions";
import { useCallback } from "react";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function ViewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(String(id), {
    refetchOnMountOrArgChange: true,
  });

  const [deleteProduct, { isError: isDeletionFailure, isLoading: isDeletionPending, isSuccess: isDeletionSuccess }] = useDeleteProductMutation();

  const { notify: notifyOnDeletion } = useSimpleStatusToast({
    isError: isDeletionFailure,
    isLoading: isDeletionPending,
    isSuccess: isDeletionSuccess,
    successMessage: "Product deleted successfully.",
    errorMessage: "Failed to delete product.",
    loadingMessage: "Deleting product...",
    idPrefix: "product-deletion",
    onFailure: () => {
      console.error("Failed to delete product");
    },
    onSuccess: () => {
      navigate(RoutePaths.PRODUCTS);
    },
  });

  const { notify: notifyDeletion } = useDeletionToast<IProduct>({
    identifierSelector(item) {
      return item.name;
    },
    onConfirm: async (item) => {
      notifyOnDeletion();
      await deleteProduct(item.id);
    },
  });

  const handleDeleteProduct = useCallback(() => {
    product && notifyDeletion(product);
  }, [product, notifyDeletion]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !product) return <div>Error loading product details.</div>;

  return (
    <CrudViewPageLayout
      breadcrumbs={[
        {
          label: "Products",
          href: RoutePaths.PRODUCTS,
        },
        {
          label: product.name,
          href: fillParametersInPath(RoutePaths.PRODUCTS_VIEW, { id: product.id }),
        },
      ]}
      title={product.name}
      actions={
        <div className="bp-product_view__actions">
          <Button variant="primary" onClick={() => navigate(fillParametersInPath(RoutePaths.PRODUCTS_EDIT, { id: product.id }))}>
            <FaEdit />
            &ensp;Edit product
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            <FaTrash />
            &ensp;Delete product
          </Button>
        </div>
      }
    >
      <div className="bp-product_view__details_container">
        <div className="bp-product_view__image_container">{product.coverId ? <img src={getImagePath(product.cover)} alt={product.name} className="bp-product_view__image" /> : <div className="bp-product_view__image_placeholder">No Image</div>}</div>
        <div className="bp-product_view__info_container">
          <Heading level={Heading.Level.H2}>Product Details</Heading>
          <dl className="bp-product_view__info_list">
            <dt>Description</dt>
            <dd>{product.description || "No description provided."}</dd>

            <dt>Brand</dt>
            <dd>
              <Button variant="link" className="p-0" onClick={() => navigate(fillParametersInPath(RoutePaths.BRANDS_VIEW, { id: product.id }))}>
                {product.brand?.name}
              </Button>
            </dd>

            <dt>Categories</dt>
            <dd>
              {product.productCategories?.length ? (
                <ul className="bp-product_view__category_list">
                  {product.productCategories.map((category) => (
                    <li key={category.id}>{category.name}</li>
                  ))}
                </ul>
              ) : (
                "No categories"
              )}
            </dd>
            {product?.measurement && (
              <>
                <dt>Measurement</dt>
                <dd>
                  {product?.measurement.magnitude} {product?.measurement.unit}
                </dd>
              </>
            )}
            <dt>Properties</dt>
            <dd>
              <ul className="bp-product_view__properties_list">
                <li>Can expire: {product.canExpire ? "Yes" : "No"}</li>
                <li>Sold as loose item: {product.isLoose ? "Yes" : "No"}</li>
                <li>Global product: {product.isGlobal ? "Yes" : "No"}</li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </CrudViewPageLayout>
  );
}
