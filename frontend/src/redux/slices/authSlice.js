import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // full user object from backend
  isAuthenticated: false, // derived truth
  isAuthLoading: true, // only true until auth check completes
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },

    stopAuthLoading: (state) => {
      state.isAuthLoading = false;
    },
  },
});

export const { addUser, clearUser, stopAuthLoading } = authSlice.actions;

export default authSlice.reducer;
