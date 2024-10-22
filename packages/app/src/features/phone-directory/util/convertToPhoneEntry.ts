import { PhoneEntry } from "@biaplanner/shared";
import { parsePhoneNumber } from "awesome-phonenumber";

export function convertToPhoneEntry(numberText: string, id?: number): [PhoneEntry | null, string | false] {
  if (numberText === "") {
    return [null, "phone-number-empty"];
  }
  if (numberText[0] !== "+") {
    numberText = `+${numberText}`;
  }

  const parsedNumber = parsePhoneNumber(numberText);

  if (!parsedNumber.valid) {
    return [null, "phone-number-invalid"];
  }

  if (!parsedNumber.possible) {
    return [null, parsedNumber.possibility];
  }

  return [
    {
      id,
      countryCode: parsedNumber.regionCode,
      countryCallingCode: parsedNumber.countryCode.toString(),
      phoneNumber: parsedNumber.number.international,
    },
    false,
  ];
}
