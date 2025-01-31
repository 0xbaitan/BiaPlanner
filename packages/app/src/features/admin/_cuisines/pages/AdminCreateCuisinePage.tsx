import { ICreateCuisineDto, ICuisine } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import CuisinesForm from "../components/CuisinesForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateCuisineMutation } from "@/apis/CuisinesApi";

export default function AdminCreateCuisinePage() {
  const [createCuisine, { isLoading, isSuccess, isError }] = useCreateCuisineMutation();

  const { setItem } = useDefaultStatusToast<ICuisine>({
    action: Action.CREATE,
    entityIdentifier: (entity) => entity.name,
    idPrefix: "cuisine",
    isError,
    isLoading,
    isSuccess,
    idSelector: (entity) => entity?.id ?? "new",
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectUrl: "/admin/cuisines",
      redirectButtonText: "Return to Cuisines",
    },
  });
  return (
    <div>
      <h1>Create Cuisine</h1>

      <CuisinesForm
        type="create"
        onSubmit={async (dto) => {
          setItem(dto as ICuisine);
          await createCuisine(dto as ICreateCuisineDto);
        }}
      />
    </div>
  );
}
