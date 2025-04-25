import "../styles/ViewBrandPage.scss";

import { FaEdit, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useNavigate, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import Heading from "@/components/Heading";
import { useGetBrandQuery } from "@/apis/BrandsApi";

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
          <Button variant="primary" onClick={() => navigate(fillParametersInPath(RoutePaths.BRANDS_EDIT, { id: brand.id }))}>
            <FaEdit />
            &ensp;Edit
          </Button>
          <Button variant="danger" onClick={() => console.log(`Delete brand with ID: ${brand.id}`)}>
            <FaTrash />
            &ensp;Delete
          </Button>
        </div>
      }
    >
      <div className="bp-brand_view__details_container">
        <div className="bp-brand_view__image_container">{brand.logoId ? <img src={`/files/${brand.logoId}`} alt={brand.name} className="bp-brand_view__image" /> : <div className="bp-brand_view__image_placeholder">No Logo</div>}</div>
        <div className="bp-brand_view__info_container">
          <Heading level={Heading.Level.H1} className="bp-brand_view__title">
            About the brand
          </Heading>
          <p className="bp-brand_view__description">{brand.description || "No description provided."}</p>
        </div>
      </div>
      <div className="bp-brand_view__products_container">
        <Heading level={Heading.Level.H2}>Products</Heading>
        {brand.products?.length && brand.products.length > 0 ? (
          <ul className="bp-brand_view__products_list">
            {brand.products?.map((product) => (
              <li key={product.id} className="bp-brand_view__products_list_item">
                {product.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products associated with this brand.</p>
        )}
      </div>
    </CrudViewPageLayout>
  );
}
