import { baseApi } from "../../baseApi";

export const wishlistSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWishlist: builder.mutation({
      query: (credentials) => {
        // console.log("Create wishlist credentials 👉", credentials);

        return {
          url: `wishlist/createWishList`,
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["CreateWishlist"],
        meta: { skipAuth: false },
    }),

    getAllWishlist: builder.query({
      query: () => `wishlist/GetAllWishList`,
      providesTags: ["CreateWishlist", "UpdateWishlist"],
      meta: {
        skipAuth: false,
      },
    }),

    addImageWishlist: builder.mutation({
      query: ({id , data}) => {
        // console.log("Create wishlist credentials 👉", id, data);

        return {
          url: `wishlist/AddImagesToWishlist/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["UpdateWishlist"],
        meta: { skipAuth: false },
    }),
  }),

  overrideExisting: true,
});

export const { useCreateWishlistMutation, useGetAllWishlistQuery, useAddImageWishlistMutation } =
  wishlistSlice;
