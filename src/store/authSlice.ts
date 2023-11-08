import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
      login: {
        currentUser: null,
        isFetching: false,
        error: false,
      },
      logout: {
        isFetching: false,
        error: false,
      },
      updatePass: {
        currentUser: null,
      },
      register: {
        currentUser: null,
        isFetching: false,
        error: false,
      }
    },
    reducers: {
      loginStart: (state) => {
        state.login.isFetching = true;
      },
      loginSuccess: (state, action) => {
        state.login.isFetching = false;
        state.login.currentUser = action.payload;
        state.login.error = false;
      },
      loginFalse: (state) => {
        state.login.isFetching = false;
        state.login.error = true;
      },
      logoutStart: (state) => {
        state.login.isFetching = true;
      },
      logoutSuccess: (state) => {
        state.login.isFetching = false;
        state.login.currentUser = null;
        state.login.error = false;
      },
      logoutFalse: (state) => {
        state.login.isFetching = false;
        state.login.error = true;
      },
      setPasswordUpdated: (state, action) => {
        state.updatePass.currentUser = action.payload;
      },
      setUserUpdated(state, action) {
        state.login.isFetching = false;
        state.login.currentUser = action.payload;
        state.login.error = false;
      },
      registerStart: (state) => {
        state.register.isFetching = true;
      },
      registerSuccess: (state, action) => {
        state.register.isFetching = false;
        state.register.currentUser = action.payload;
        state.register.error = false;
      },
      registerFalse: (state) => {
        state.register.isFetching = false;
        state.register.error = true;
      },
    },
  });
  
  export const {
    loginStart,
    loginSuccess,
    loginFalse,
    logoutStart,
    logoutSuccess,
    logoutFalse,
    setPasswordUpdated,
    setUserUpdated,
    registerStart,
    registerSuccess,
    registerFalse,
  } = authSlice.actions;
  
  export default authSlice;