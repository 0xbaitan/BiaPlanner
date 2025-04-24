import { ICuisine, IUpdateCuisineDto } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetCuisineQuery, useUpdateCuisineMutation } from "@/apis/CuisinesApi";

import CuisinesForm from "../components/CuisinesForm";
import { Status } from "@/hooks/useStatusToast";
import { useParams } from "react-router-dom";

export default function AdminUpdateCuisinePage() {
  const { id } = useParams();
  const { data: cuisine } = useGetCuisineQuery(String(id));
  const [updateCuisine, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateCuisineMutation();

  const { setItem } = useDefaultStatusToast<ICuisine>({
    idSelector: (entity) => entity.id,
    action: Action.UPDATE,
    entityIdentifier: (entity) => entity.name,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    idPrefix: "cuisine",
    isLoading: isUpdateLoading,
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Return to Cuisines",
      redirectUrl: "/admin/cuisines",
    },
  });

  return (
    <div>
      <h2>Update Cuisine</h2>
      {cuisine ? (
        <CuisinesForm
          type="update"
          initialValue={cuisine}
          onSubmit={async (dto) => {
            setItem(dto as ICuisine);
            await updateCuisine(dto as IUpdateCuisineDto);
          }}
          disableSubmit={isUpdateLoading}
        />
      ) : (
        <div>Could not find cuisine</div>
      )}
    </div>
  );
}
