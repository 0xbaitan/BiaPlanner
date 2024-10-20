import {
  PhoneReducerState,
  phoneDirectoryActions,
} from "../reducers/PhoneDirectoryReducer";
import { StoreState, useStoreDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { useCallback } from "react";

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
