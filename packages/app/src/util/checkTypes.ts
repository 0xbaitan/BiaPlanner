import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export function isSerializedError(value: unknown): value is SerializedError {
  const candidate = value as SerializedError;
  return !!candidate.code && (!!candidate.message || !!candidate.name || !!candidate.stack);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isFetchBaseQueryError(value: unknown): value is FetchBaseQueryError {
  const candidate = value as FetchBaseQueryError;
  return !!candidate.status && !!candidate.data;
}
