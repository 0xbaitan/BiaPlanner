import ms from "ms";
export function convertDurationStringToMilli(str: string): number {
  return ms(str).valueOf();
}
