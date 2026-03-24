import { baseApi } from "../../baseApi";

export const communitySlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getAllPost: builder.query({
      query: () => `community/getAllPost`,
      providesTags: ["CommunityPosts", "FollowedUser"],
      meta: {
        skipAuth: false,
      },
    }),


    addReaction: builder.mutation({
      query: (credentials) => {
        // console.log("REACTION CREDENTIALS", credentials);

        return {
          url: `community/ReactToPost`,
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["CommunityPosts"], // Make sure this matches your getAllPost query
    }),
    addReport: builder.mutation({
      query: (credentials) => {
        // console.log("REPORT CREDENTIALS", credentials);

        return {
          url: `report/reportCreate`,
          method: "POST",
          body: credentials,
        };
      },
      // invalidatesTags: ["CommunityPosts"], // Make sure this matches your getAllPost query
    }),
  }),

  overrideExisting: true,
});

export const {
  //   useCreateAddItemMutation,

  useGetAllPostQuery,

  useAddReactionMutation,

  useAddReportMutation

  //   useGetAllMaterialQuery,

  //   useGetAllItemQuery,

  //   useGetAllStyleQuery
  //   useGetPopularattractionQuery,
  //   useGetAllAttractionByCountryQuery,
  //   useUpdateProviderHotelMutation,
  //   useGetAllAttractionBookingQuery,
  //   useGetSingleAttractionQuery
} = communitySlice;
