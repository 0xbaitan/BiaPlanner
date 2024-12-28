import { rootApi } from ".";

export const remindersApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    sendTestReminder: build.mutation<void, void>({
      query: () => ({
        url: `/reminders/emails/test`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Reminder" as const, id: "LIST" }],
    }),
  }),
});

export const { useSendTestReminderMutation } = remindersApi;
