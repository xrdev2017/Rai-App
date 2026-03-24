import { baseApi } from "../../baseApi";

export const createPlannerSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPlanner: builder.mutation({
      query: (credentials) => {
        // console.log("Create Planner credentials 👉", credentials);

        return {
          url: `planner/createPlanner`,
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["CreatePlanner"],
        meta: { skipAuth: false },
    }),

    getAllPlanner: builder.query({
      query: () => `planner/getAllPlanner`,
      providesTags: ["CreatePlanner", "DeletePlanner", "UpdatePlanner", "UpdateOutfitItem"],
    }),

    deletePlanner: builder.mutation({
      query: (id) => {
        // console.log("Create Planner credentials 👉", id);

        return {
          url: `planner/deletePlanner/${id}`,
          method: "DELETE",
          body: id,
        };
      },
      invalidatesTags: ["DeletePlanner"],
        meta: { skipAuth: false },
    }),

    updatePlanner: builder.mutation({
      query: ({ id, data }) => {
        // console.log("Create Planner credentials 👉", id, data);

        return {
          url: `planner/UpdatePlannerTime/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["UpdatePlanner"],
        meta: { skipAuth: false },
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreatePlannerMutation,
  useGetAllPlannerQuery,
  useDeletePlannerMutation,
  useUpdatePlannerMutation,
} = createPlannerSlice;
