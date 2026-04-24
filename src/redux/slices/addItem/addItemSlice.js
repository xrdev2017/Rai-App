import { baseApi } from "../../baseApi";

export const addItemSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAddItem: builder.mutation({
      query: (credentials) => {
        console.log("Booking credentials 👉", credentials);

        return {
          url: `items/CreateItem`,
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["CreateAddItem"],
      //   meta: { skipAuth: false },
    }),

    getAllCategory: builder.query({
      query: () => `Category/getAllCategory`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    getAllMaterial: builder.query({
      query: () => `Metarial/getAllMetarial`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    getAllStyle: builder.query({
      query: () => `Style/getAllStyle`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    updateAddItem: builder.mutation({
      query: ({ id, data }) => {
        // console.log("Update item with ID:", id, data);

        return {
          url: `items/updateItem/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["UpdateAddItem"],
    }),

    getAllItem: builder.query({
      query: ({  searchTerm, ...filters } = {}) => {
        // console.log(filters);

        const paramsObj = {  ...filters };

        if (searchTerm && searchTerm.trim()) {
          paramsObj.searchTerm = searchTerm.trim();
        }

        const params = new URLSearchParams(paramsObj).toString();
        console.log("LINE AT 64", `items/getItems?${params}`);

        return `items/getItems?${params}`;
      },
      providesTags: ["CreateAddItem", "UpdateAddItem", "DeleteAddItem"],
      meta: { skipAuth: false },
    }),

    getAllBrands: builder.query({
      query: () => `items/getAllBrands`,
      //   providesTags: ['CreateProviderHotels', 'UpdateProviderSingleHotel'],
      // meta: {
      //   skipAuth: false,
      // },
    }),

    deleteItem: builder.mutation({
      query: (id) => {
        // console.log("Booking credentials 👉", id);

        return {
          url: `items/deleteItem/${id}`,
          method: "DELETE",
          // body: credentials,
        };
      },
      invalidatesTags: ["DeleteAddItem"],
    }),

    getAiGeneratedOutfits: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => {
        let url = `outfits/getAiGeneratedOutfit?page=${page}&limit=${limit}`;
        if (search && search.trim()) {
          url += `&search=${search.trim()}`;
        }
        return url;
      },
      providesTags: ["CreateOutfit"],
      meta: { skipAuth: false },
    }),

    virtualTryOn: builder.mutation({
      query: ({ formData, userId }) => ({
        url: `virtualTryOn/try-on`,
        method: "POST",
        body: formData,
        headers: {
          "user_id": userId
        }
      })
    })
  }),

  overrideExisting: true,
});

export const {
  useCreateAddItemMutation,

  useGetAllCategoryQuery,

  useGetAllMaterialQuery,

  useGetAllItemQuery,

  useGetAllStyleQuery,

  useUpdateAddItemMutation,

  useGetAllBrandsQuery,

  useDeleteItemMutation,

  useGetAiGeneratedOutfitsQuery,
  useVirtualTryOnMutation
} = addItemSlice;
