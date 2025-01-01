import convertToSentenceCase from "./convertToSentenceCase";

export default function normaliseEnumKey(key: string) {
  return convertToSentenceCase(key.replaceAll("_", " "));
}
