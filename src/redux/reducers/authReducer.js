import { createSlice } from "@reduxjs/toolkit";

const authReducer = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    googleApple: false,
    notificationsEnabled: true, // ✅ default ON
    hasSeenOnboarding: false,
  },
  reducers: {
    completeOnboarding: (state) => {
      state.hasSeenOnboarding = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setGoogleApple: (state, action) => {
      state.googleApple = action.payload;
    },
    setNotificationsEnabled: (state, action) => {
      state.notificationsEnabled = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.googleApple = false;
      state.notificationsEnabled = true; // reset to default
    },
  },
});

export const {
  setToken,
  setUser,
  clearAuth,
  setNotificationsEnabled,
  setGoogleApple,
  completeOnboarding,
} = authReducer.actions;

export default authReducer.reducer;
