import "./PhoneDirectory";
import "./User";
import "./dto";

export * from "./dto";
export * from "./PhoneDirectory";
export * from "./User";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}
