import { jwtDecode } from "jwt-decode";
import { baseApi } from "../baseApi.js";
import {
  clearAuth,
  completeOnboarding,
  setGoogleApple,
  setToken,
  setUser,
} from "../reducers/authReducer.js";

export const authSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log("Login data:", data);
          dispatch(setToken(data?.token));
          dispatch(setUser(data?.data));
          dispatch(completeOnboarding())
          // dispatch(setUser(jwtDecode(data?.data?.accessToken)));
          // dispatch(setToken(data?.data?.accessToken)); // ✅ store ACCESS token, not refresh
          // dispatch(setUser(jwtDecode(data.access))); // optional
        } catch (error) {
          // console.log(error);
        }
      },
      // providesTags: ["FollowedUser"],
    }),

    register: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 register credentials:", credentials); // ✅ Log credentials here
        return {
          url: "auth/signup",
          method: "POST",
          body: credentials,
        };
      },
      // invalidatesTags: ['players'],
      // meta: {
      //   skipAuth: true, // ✅ This tells prepareHeaders to skip Authorization
      // },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "auth/signout",
        method: "POST",
        // body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(clearAuth()); // Clear token and user data
        } catch (error) {
          // console.log("Logout error:", error);
        }
      },
    }),

    forgotPasswordEmail: builder.mutation({
      query: (credentials) => ({
        url: "auth/forget-password",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyCode: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 verifyCode credentials:", credentials); // ✅ Log credentials here
        return {
          url: "auth/VerifyOtp",
          method: "POST",
          body: credentials,
        };
      },
    }),

    resetPassword: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 resetPassword credentials:", credentials); // ✅ Log credentials here

        return {
          url: "auth/reset-password",
          method: "POST",
          body: credentials,
        };
      },

      meta: {
        skipAuth: false, // ✅ This tells prepareHeaders to skip Authorization
      },
    }),

    getProviderProfile: builder.query({
      query: () => "/users/my-profile",
      providesTags: ["ProviderProfile"],
      meta: {
        skipAuth: false, // or true if you want to skip setting the Authorization header
      },
    }),

    updateProfile: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 updateProfile credentials:", credentials); // ✅ Log credentials here

        return {
          url: "privacy/changePrivacy",
          method: "PATCH",
          body: credentials,
        };
      },
      invalidatesTags: ["UpdateProfile"],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    updateProfileInfo: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 updateProfile credentials:", credentials); // ✅ Log credentials here

        return {
          url: "profile/updateProfile",
          method: "PATCH",
          body: credentials,
        };
      },
      invalidatesTags: ["UpdateProfile"],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    getSingleUser: builder.query({
      query: ({ id }) => {
        // console.log("LINE AT 111", id);

        return `users/${id}`;
      },
      // meta: {
      //   skipAuth: false, // or true if you want to skip setting the Authorization header
      // },
    }),

    deleteUserAccount: builder.mutation({
      query: (credentials) => ({
        url: "users/my-account",
        method: "PATCH",
        // body: credentials, // optional, DELETE usually doesn’t need a body
      }),
      // meta: {
      //   skipAuth: false, // or true if you want to skip setting the Authorization header
      // },
    }),

    getPrivacyPolicy: builder.query({
      query: () => `policy`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    getTerms: builder.query({
      query: () => `terms-conditions`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    getAbout: builder.query({
      query: () => `settings/about`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    sendNotification: builder.mutation({
      query: ({ id, ...credentials }) => {
        // console.log(
        //   "🔐 sendNotification credentials:",
        //   credentials,
        //   "USER ID 157",
        //   id
        // ); // ✅ Log credentials here

        return {
          url: `notifications/send-notification/${id}`,
          method: "POST",
          body: credentials,
        };
      },
      // meta: {
      //   skipAuth: false, // or true if you want to skip setting the Authorization header
      // },
    }),

    follow: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 register credentials:", credentials); // ✅ Log credentials here
        return {
          url: "followAndUnfollow/follow",
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["FollowedUser"],
      // meta: {
      //   skipAuth: true, // ✅ This tells prepareHeaders to skip Authorization
      // },
    }),

    updatePassword: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 updatePassword credentials:", credentials); // ✅ Log credentials here

        return {
          url: "auth/reset-password",
          method: "POST",
          body: credentials,
        };
      },
    }),

    getAllBlockedUser: builder.query({
      query: () => `blocked/AllblockedUser`,
      providesTags: ["BlockedUser"],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    deleteAccount: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 register credentials:", credentials); // ✅ Log credentials here
        return {
          url: "DeleteAccount/deleteRequest",
          method: "POST",
          // body: credentials,
        };
      },
      // invalidatesTags: ["FollowedUser"],
      // meta: {
      //   skipAuth: true, // ✅ This tells prepareHeaders to skip Authorization
      // },
    }),

    sendFeedback: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 register credentials:", credentials); // ✅ Log credentials here
        return {
          url: "Feedback/createFeedback",
          method: "POST",
          body: credentials,
        };
      },
      // invalidatesTags: ["FollowedUser"],
      // meta: {
      //   skipAuth: true, // ✅ This tells prepareHeaders to skip Authorization
      // },
    }),

    block: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 register credentials:", credentials); // ✅ Log credentials here
        return {
          url: "blocked/block",
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["BlockedUser"],
      // meta: {
      //   skipAuth: true, // ✅ This tells prepareHeaders to skip Authorization
      // },
    }),

    getSelectedUserItem: builder.query({
      query: (id) => {
        // console.log("LINE AT 279", id);

        return `/userInfoById/items/${id}`;
      },
    }),

    getSelectedUserOutfit: builder.query({
      query: (id) => {
        // console.log("LINE AT 285", id);
        return `userInfoById/outfits/${id}`;
      },
    }),

    getSelectedUserLookbook: builder.query({
      query: (id) => {
        // console.log("LINE AT 291", id);
        return `userInfoById/lookbooks/${id}`;
      },
    }),

    // community screen

    getAllUser: builder.query({
      query: () => `myCommunity/non-connected`,
      providesTags: ["FollowedUser"],
    }),

    getAllFollowerUser: builder.query({
      query: () => `myCommunity/follower`,
      providesTags: ["FollowedUser"],
    }),

    getAllFollowingUser: builder.query({
      query: () => `myCommunity/following`,
      providesTags: ["FollowedUser"],
    }),

    // analystics
    getUsageStats: builder.query({
      query: () => `usage/getUsageStats`,
      // providesTags: ["FollowedUser"],
    }),

    getMostWardOutfits: builder.query({
      query: () => `usage/getMostWardOutfits`,
      // providesTags: ["FollowedUser"],
    }),

    getColorCount: builder.query({
      query: () => `usage/getColorCount`,
      // providesTags: ["FollowedUser"],
    }),
    getProfileUpdate: builder.query({
      query: () => `profile/getProfile`,
      providesTags: ["UpdateProfile"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // Flatten the response so that user properties are at the top level
            // but the subscription object is also preserved.
            const userData = data.user 
              ? { ...data.user, subscription: data.subscription } 
              : data;
            dispatch(setUser(userData));
          }
        } catch (error) {
          // console.error("Get Profile Error:", error);
        }
      },
    }),

    googleAppleSignin: builder.mutation({
      query: (credentials) => {
        // console.log("🔐 register credentials:", credentials); // ✅ Log credentials here
        return {
          url: "auth/googleApple",
          method: "POST",
          body: credentials,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log("Login data:", data);
          dispatch(setToken(data?.token));
          dispatch(setUser(data?.user));
          dispatch(setGoogleApple(true));
          // dispatch(setUser(jwtDecode(data?.data?.accessToken)));
          // dispatch(setToken(data?.data?.accessToken)); // ✅ store ACCESS token, not refresh
          // dispatch(setUser(jwtDecode(data.access))); // optional
        } catch (error) {
          // console.log(error);
        }
      },
      // invalidatesTags: ['players'],
      // meta: {
      //   skipAuth: true, // ✅ This tells prepareHeaders to skip Authorization
      // },
    }),
    verifyIosPurchase: builder.mutation({
      query: (credentials) => ({
        url: "verify/ios",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log("🚀 verifyIosPurchase Request Params:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("✅ verifyIosPurchase Response:", data);
        } catch (error) {
          console.error("❌ verifyIosPurchase Error:", error);
        }
      },
    }),
    verifyAndroidPurchase: builder.mutation({
      query: (credentials) => ({
        url: "verify/android",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log("🚀 verifyAndroidPurchase Request Params:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("✅ verifyAndroidPurchase Response:", data);
        } catch (error) {
          console.error("❌ verifyAndroidPurchase Error:", error);
        }
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,

  useForgotPasswordEmailMutation,

  useResetPasswordMutation,

  useVerifyCodeMutation,

  useGetProviderProfileQuery,

  useUpdateProfileMutation,

  useGetSingleUserQuery,

  useDeleteUserAccountMutation,

  useGetPrivacyPolicyQuery,

  useGetTermsQuery,

  useGetAboutQuery,

  useSendNotificationMutation,

  useFollowMutation,

  useUpdatePasswordMutation,

  useGetAllBlockedUserQuery,

  useDeleteAccountMutation,

  useSendFeedbackMutation,

  useBlockMutation,

  useGetSelectedUserItemQuery,

  useGetSelectedUserOutfitQuery,

  useGetSelectedUserLookbookQuery,

  // community screen
  useGetAllUserQuery,
  useGetAllFollowerUserQuery,
  useGetAllFollowingUserQuery,

  //analytics
  useGetUsageStatsQuery,
  useGetMostWardOutfitsQuery,
  useGetColorCountQuery,

  // get profile update

  useGetProfileUpdateQuery,
  useLazyGetProfileUpdateQuery,

  useGoogleAppleSigninMutation,

  useUpdateProfileInfoMutation,
  useVerifyIosPurchaseMutation,
  useVerifyAndroidPurchaseMutation,
} = authSlice;
