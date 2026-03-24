import { baseApi } from "../../baseApi";

export const createOutfitSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOutfit: builder.mutation({
      query: (credentials) => {
        // console.log("Create outfit credentials 👉", credentials);
        return {
          url: `outfits/createOutfit`,
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["CreateOutfit"],
        meta: { skipAuth: false },
    }),

    getAllOutfit: builder.query({
      query: ({  searchTerm, ...filters } = {}) => {
        // console.log(filters);

        const paramsObj = { ...filters };

        if (searchTerm && searchTerm.trim()) {
          paramsObj.searchTerm = searchTerm.trim();
        }

        const params = new URLSearchParams(paramsObj).toString();
        console.log("LINE AT 64", `outfits/showOutfits?${params}`);

        return `outfits/showOutfits?${params}`;
      },

      providesTags: ["CreateOutfit", "UpdateOutfitItem", "DeleteAddOutfit"],
      meta: {
        skipAuth: false,
      },
    }),

    updateCreateOutfit: builder.mutation({
      query: ({ id, data }) => {
        // console.log("Update outfit with ID:", id, data);
        return {
          url: `outfits/updateOutfit/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["UpdateOutfitItem"],
    }),

    deleteOutfit: builder.mutation({
      query: (id) => {
        // console.log("Booking credentials 👉", id);

        return {
          url: `outfits/deleteOutfit/${id}`,
          method: "DELETE",
          // body: credentials,
        };
      },
      invalidatesTags: ["DeleteAddOutfit"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateOutfitMutation,
  useGetAllOutfitQuery,
  useUpdateCreateOutfitMutation,
  useDeleteOutfitMutation,
} = createOutfitSlice;
