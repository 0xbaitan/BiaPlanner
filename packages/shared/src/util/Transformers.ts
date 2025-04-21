import { TransformFnParams } from "class-transformer";

export function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return undefined;
}

export function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return undefined;
}

export function toString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return undefined;
}

export function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map((item) => toString(item) ?? "");
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [toString(value) ?? ""];
  }
  return undefined;
}
export function trimString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.trim();
  }

  return undefined;
}

export function transform(params: TransformFnParams, transformFn: (value: unknown) => unknown): unknown {
  const { value } = params;
  return transformFn(value);
}
