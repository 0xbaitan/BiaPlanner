export default function removePhoneNumberFormatting(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}
