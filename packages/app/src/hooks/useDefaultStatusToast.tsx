import useStatusToast, { Status, StatusToastProps } from "./useStatusToast";

import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export enum Action {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  READ = "read",
}
export type DefaultStatusToastProps<T> = Omit<StatusToastProps<T>, "item" | "contentCreator"> & {
  entityIdentifier: (item: T) => string;
  action: Action;
  redirectContent?: {
    redirectButtonText: string;
    redirectUrl: string;
    applicableStatuses: Status[];
  };
};

function createToastMessage(entity: string, action: Action, status: Status) {
  if (action === Action.CREATE) {
    switch (status) {
      case "success":
        return `${entity} was created successfully`;
      case "error":
        return `Failed to create ${entity}`;
      case "loading":
        return `Creating ${entity}...`;
      default:
        return `Unknown status regarding the creation of ${entity}`;
    }
  } else if (action === Action.UPDATE) {
    switch (status) {
      case "success":
        return `${entity} was updated successfully`;
      case "error":
        return `Failed to update ${entity}`;
      case "loading":
        return `Updating ${entity}...`;
      default:
        return `Unknown status regarding the update of ${entity}`;
    }
  } else if (action === Action.DELETE) {
    switch (status) {
      case "success":
        return `${entity} was deleted successfully`;
      case "error":
        return `Failed to delete ${entity}`;
      case "loading":
        return `Deleting ${entity}...`;
      default:
        return `Unknown status regarding the deletion of ${entity}`;
    }
  } else if (action === Action.READ) {
    switch (status) {
      case "success":
        return `${entity} was read successfully`;
      case "error":
        return `Failed to read ${entity}`;
      case "loading":
        return `Reading ${entity}...`;
      default:
        return `Unknown status regarding the reading of ${entity}`;
    }
  } else {
    return "Unknown action";
  }
}
export default function useDefaultStatusToast<T>(props: DefaultStatusToastProps<T>) {
  const { redirectContent } = props;
  const navigate = useNavigate();
  return useStatusToast<T>({
    ...props,
    contentCreator: (item, status) => {
      const { entityIdentifier, action } = props;
      const entity = entityIdentifier(item);
      const message = createToastMessage(entity, action, status);
      return (
        <div>
          <div>{message}</div>
          {redirectContent && redirectContent.applicableStatuses.includes(status) && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigate(redirectContent.redirectUrl);
              }}
            >
              {redirectContent.redirectButtonText}
            </Button>
          )}
        </div>
      );
    },
  });
}
