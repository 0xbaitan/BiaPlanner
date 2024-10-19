import { PhoneEntry } from "@biaplanner/shared";
import { rootApi } from ".";

export const phoneEntriesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getPhoneEntries: build.query<PhoneEntry[], void>({
      query: () => ({
        url: "/phone-entries",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPhoneEntriesQuery } = phoneEntriesApi;
