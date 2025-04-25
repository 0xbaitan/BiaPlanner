import { serialize } from "object-to-formdata";

export default function serialiseIntoFormData<T>(data: T): FormData {
  const formData = serialize({ ...data }, { indices: true, nullsAsUndefineds: true, allowEmptyArrays: true, dotsForObjectNotation: true });

  return formData;
}
