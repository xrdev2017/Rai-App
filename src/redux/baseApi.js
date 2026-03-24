import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "baseApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://wardrop.onrender.com/" }),
  // baseQuery: fetchBaseQuery({ baseUrl: "https://backendrai.rairus.com/" }),
  baseQuery: baseQueryWithReauth,
  credentials: "include",
  tagTypes: [
    "CreateAddItem",
    "CreateOutfit",
    "CreateLookbook",
    "UpdateProfile",
    "FollowedUser",
    "CommunityPosts",
    "CreateWishlist",
    "CreatePlanner",
    "UpdateAddItem",
    "DeletePlanner",
    "Notifications",
    "UpdateWishlist",
    "UpdatePlanner",
    "UpdateOutfitItem",
    "DeleteAddItem",
    "DeleteAddOutfit",
    "BlockedUser",
    "UpdateLookbook",
  ],

  endpoints: () => ({}),
});

// export const baseApi = createApi({
//   reducerPath: 'baseApi',
//   baseQuery: fetchBaseQuery({baseUrl: 'http://10.0.60.53:8000'}),
//   prepareHeaders: (headers, {getState}) => {
//     const token = getState().auth.token;
//     console.log('LINE AT 21 ', token);

//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },

//   endpoints: () => ({}),
//   tagTypes: ['players'],
// });

// export const baseApi = createApi({
//   reducerPath: 'baseApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'https://basketball-52yg.onrender.com',
//     prepareHeaders: (headers, {getState, endpoint}) => {
//       const skipAuth = baseApi.endpoints[endpoint]?.definition?.meta?.skipAuth;

//       if (!skipAuth) {
//         const token = getState().auth.token;
//         console.log('LINE AT 21 — token from store:', token);
//         if (token) {
//           headers.set('Authorization', `Bearer ${token}`);
//           console.log('Authorization header:', headers.get('Authorization'));
//         } else {
//           console.log('❌ No token found in Redux');
//         }
//       } else {
//         console.log(`🔓 Skipping Authorization for endpoint: ${endpoint}`);
//       }

//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
//   tagTypes: ['players'],
// });

// export const baseApi = createApi({
//   reducerPath: 'baseApi',
//   // baseQuery: fetchBaseQuery({
//   //   // baseUrl: 'https://basketball-52yg.onrender.com',
//   //   // baseUrl: 'https://bbe96cdaf568.ngrok-free.app',
//   //   // baseUrl: 'http://10.10.7.76:8001',

//   //   }),
//   tagTypes: [
//     'ProviderProfile',
//     'CreateProviderHotels',
//     'UpdateProviderSingleHotel',
//     'CreateProviderSecurity',
//     'UpdateProviderSingleSecurity',
//     'CreateProviderCar',
//     'UpdateProviderSingleCar',
//     'CreateProviderAttraction',
//     'UpdateProviderSingleAttraction',

//     'CreateBookingHotels',
//     'AddFavouriteHotel',

//     'CreateBookingSecurity',

//     'CreateBookingAttraction',

//     'CreateBookingCar'
//   ],
//   baseQuery: fetchBaseQuery({
//     // baseUrl: 'http://10.10.20.19:5000/api/v1',
//     baseUrl: 'https://timothy-backend.onrender.com/api/v1',
//     // baseUrl:
//     //   'https://received-chen-proceedings-officer.trycloudflare.com/api/v1',
//     // baseUrl:
//     //   'https://toward-relief-harley-adjustment.trycloudflare.com/api/v1',
//     prepareHeaders: (headers, { getState, endpoint }) => {
//       const skipAuth = baseApi.endpoints[endpoint]?.definition?.meta?.skipAuth;
//       // console.log(skipAuth);

//       if (!skipAuth) {
//         const token = getState().auth.token;
//         // console.log('LINE AT 21 — token from store:', token);
//         if (token) {
//           headers.set('Authorization', `${token}`);
//           // console.log('Authorization header:', headers.get('Authorization'));
//         } else {
//           console.log('❌ No token found in Redux');
//         }
//       } else {
//         console.log(`🔓 Skipping Authorization for endpoint: ${endpoint}`);
//       }

//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
// });
