import "../styles/ViewProductPage.scss";

import { FaEdit, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useDeleteProductMutation, useGetProductByIdQuery } from "@/apis/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "@/components/Alert";
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
          label: `${product.name}`,
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
          <Heading level={Heading.Level.H1} className="bp-product_view__title">
            About the product
          </Heading>
          <p className="bp-product_view__description">{product.description || "No description provided."}</p>
          <div className="bp-product_view__details">
            <div>
              <strong>Brand:</strong> {product.brand?.name || "No brand associated"}
            </div>
            <div>
              <strong>Measurement:</strong> {product.measurement.magnitude} {product.measurement.unit}
            </div>
            <div>
              <strong>Can Expire:</strong> {product.canExpire ? "Yes" : "No"}
            </div>
            {product.canQuicklyExpireAfterOpening && (
              <div>
                <strong>Expires Quickly After Opening:</strong> {product.timeTillExpiryAfterOpening?.magnitude} {product.timeTillExpiryAfterOpening?.unit}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bp-product_view__categories_container">
        <Heading level={Heading.Level.H2} className="bp-product_view__categories_heading">
          Product Categories
        </Heading>
        {product.productCategories?.length && product.productCategories.length > 0 ? (
          <ul className="bp-product_view__categories_list">
            {product.productCategories.map((category) => (
              <li key={category.id} className="bp-product_view__categories_list_item">
                {category.name}
              </li>
            ))}
          </ul>
        ) : (
          <Alert variant="warning" title="No Categories Found" message="This product does not belong to any categories." />
        )}
      </div>
    </CrudViewPageLayout>
  );
}
