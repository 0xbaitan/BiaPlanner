import { IUser, PhoneEntry } from "@biaplanner/shared";
import { PhoneReducerState, phoneDirectoryActions } from "../reducers/PhoneDirectoryReducer";
import { StoreState, useStoreDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { useCallback } from "react";
import { useLazyGetUserQuery } from "@/apis/UsersApi";

export default function usePhoneDirectoryState() {
  return useSelector((state: StoreState) => state.phoneDirectory);
}

export function useSetUserFormModalOpenState() {
  const dispatch = useStoreDispatch();
  const setUserFormModalOpenState = useCallback(
    (isOpen: boolean) => {
      dispatch(phoneDirectoryActions.setUserFormModalOpenState(isOpen));
    },
    [dispatch]
  );
  return setUserFormModalOpenState;
}

export function useSetActivePhoneEntry() {
  const dispatch = useStoreDispatch();
  const setActivePhoneEntry = useCallback(
    (phoneEntry: PhoneEntry | undefined) => {
      dispatch(phoneDirectoryActions.setActivePhoneEntryId(phoneEntry));
    },
    [dispatch]
  );
  return setActivePhoneEntry;
}

export function useSetShowPhoneEntryDeletionWarning() {
  const dispatch = useStoreDispatch();
  const setShowPhoneEntryDeletionWarning = useCallback(
    (isOpen: boolean) => {
      dispatch(phoneDirectoryActions.setShowPhoneEntryDeletionWarning(isOpen));
    },
    [dispatch]
  );
  return setShowPhoneEntryDeletionWarning;
}

export function useSetShowUpdateUserForm() {
  const dispatch = useStoreDispatch();
  const setShowUpdateUserForm = useCallback(
    (isOpen: boolean) => {
      dispatch(phoneDirectoryActions.setShowUpdateUserForm(isOpen));
    },
    [dispatch]
  );
  return setShowUpdateUserForm;
}

export function useSetActiveUser() {
  const dispatch = useStoreDispatch();
  const setActiveUser = useCallback(
    (user: IUser | undefined) => {
      dispatch(phoneDirectoryActions.setActiveUser(user));
    },
    [dispatch]
  );
  return setActiveUser;
}

export function useShowUpdateUserForm() {
  const setShowUpdateUserForm = useSetShowUpdateUserForm();
  const setActiveUser = useSetActiveUser();
  const [getUser] = useLazyGetUserQuery();
  const showUpdateUserForm = useCallback(async (userId: number) => {
    const user = await getUser(userId).unwrap();

    if (!user) {
      console.error("Error fetching user");
      return;
    }
    setActiveUser(user);
    setShowUpdateUserForm(true);
  }, []);

  return showUpdateUserForm;
}
