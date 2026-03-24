import { baseApi } from "../../baseApi";

export const dressMeSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDressMe: builder.mutation({
      query: (credentials) => {
        // console.log("Create outfit credentials 👉", credentials);

        return {
          url: `DressMe/createDressMe`,
          method: "POST",
          body: credentials,
        
        };
      },
      invalidatesTags: ["CreateOutfit"],
        meta: { skipAuth: false },
    }),


  }),

  overrideExisting: true,
});

export const { useCreateDressMeMutation } = dressMeSlice;
