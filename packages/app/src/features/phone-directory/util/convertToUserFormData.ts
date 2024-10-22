import { UserDto } from "@biaplanner/shared";
import { UserFormData } from "../components/UserForm";
import dayjs from "dayjs";
import removePhoneNumberFormatting from "./removePhoneNumberFormatting";

export default function convertToUserFormData(user: UserDto): UserFormData {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: dayjs(user.dateOfBirth).format("YYYY-MM-DD"),
    phoneEntries:
      user.phoneEntries?.map((entry) => ({
        phoneNumber: removePhoneNumberFormatting(entry.phoneNumber),
        id: entry.id,
      })) || [],
  };
}
