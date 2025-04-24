import { delay, select, takeLatest } from "typed-redux-saga";

import { IAccessJWTObject } from "@biaplanner/shared";
import dayjs from "dayjs";
import { initiateLogin } from "./AuthenticationReducer";
import { toast } from "react-toastify";

function* checkTokenValidityCronSaga() {
  while (true) {
    const token = (yield select((state) => state.authentication.accessTokenObject)) as IAccessJWTObject | null;

    while (true) {
      if (token) {
        const expiryTime = token.expiryTime;
        if (expiryTime) {
          const expiryTime = dayjs(token.expiryTime);
          const currentTime = dayjs();
          if (currentTime.isAfter(expiryTime.subtract(1, "minute"))) {
            toast.warning("You will be logged out in a minute", {
              toastId: "token-expiry",
              autoClose: 1000,
            });
          }
        }
      }

      yield delay(1000);
    }
  }
}

export default function* authenticationSaga() {
  yield checkTokenValidityCronSaga();
}
