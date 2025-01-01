import { IPhoneEntry } from "@biaplanner/shared";
import { rootApi } from ".";

export const phoneEntriesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getPhoneEntries: build.query<IPhoneEntry[], void>({
      query: () => ({
        url: "/phone-entries",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "PhoneEntry" as const, id })), { type: "PhoneEntry", id: "LIST" }] : [{ type: "PhoneEntry", id: "LIST" }]),
    }),

    deletePhoneEntry: build.mutation<void, number>({
      query: (id) => ({
        url: `/phone-entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PhoneEntry", "User"],
    }),
  }),
});

export const { useGetPhoneEntriesQuery, useDeletePhoneEntryMutation } = phoneEntriesApi;
