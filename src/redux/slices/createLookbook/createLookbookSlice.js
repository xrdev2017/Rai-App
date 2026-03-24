import { baseApi } from "../../baseApi";

export const createLookbookSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLookbook: builder.mutation({
      query: (credentials) => {
        // console.log("Create Lookbook credentials 👉", credentials);

        return {
          url: `lookbook/CreateLookBook`,
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["CreateLookbook"],
        meta: { skipAuth: false },
    }),


    getAllLookbook: builder.query({
      query: () => `lookbook/GetAllLookbook`,
      providesTags: ["CreateLookbook", "UpdateLookbook"],
      meta: {
        skipAuth: false,
      },
    }),

    deleteItemOutfitLookbook: builder.mutation({
      query: ({ id, ...credentials }) => {
        // console.log("Create Lookbook credentials 👉",id, credentials);

        return {
          url: `lookbook/removeItemsOrOutfitToLookbook/${id}`,
          method: "PATCH",
          body: credentials,
        };
      },
      invalidatesTags: ["UpdateLookbook"],
        meta: { skipAuth: false },
    }),
  }),

  overrideExisting: true,
});

export const { useCreateLookbookMutation, useGetAllLookbookQuery ,useDeleteItemOutfitLookbookMutation } =
  createLookbookSlice;
