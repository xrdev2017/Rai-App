import { baseApi } from "../../baseApi";

export const notificationsSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: () => {
        // console.log("➡️ API Called: notification/GetAllNotification");
        return `notification/GetAllNotification`;
      },
      providesTags: ["Notifications"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserNotificationsQuery } = notificationsSlice;
