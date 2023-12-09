import { AxiosError } from "axios";
import { axiosInstance } from "../api/instance";
import { updateUserProfile } from "../api/auth.api";

import {
	// loginStart,
	loginSuccess,
	// loginFalse,
	// logoutStart,
	// logoutSuccess,
	// logoutFalse,
	// registerStart,
	registerSuccess,
	// registerFalse,
	setUserUpdated
} from "./authSlice";

import { UserLogin } from "../types/model/userLogin";
import { UserRegister } from "../types/model/userRegister";
import { Action, Dispatch } from "redux";
import { UserUpdate } from "../types/model/userUpdate";
import { createAction } from "@reduxjs/toolkit";

export const loginUser = async (user: UserLogin, dispatch: Dispatch<Action>, navigate: (path: string) => void) => {
	dispatch(createAction("auth/loginStart")());
	try {
		const res = await axiosInstance.post("/auths/login", user);
		localStorage.setItem("accessToken", res.data.token);
		const resUserProfile = await axiosInstance.get("/users/profile");
		dispatch(loginSuccess(resUserProfile.data));
		navigate("/home");
	} catch (err: unknown) {
		dispatch(createAction("auth/loginFalse")());
		const error = err as AxiosError;
		console.log(error);
		return error.response?.status;
	}
};

export const registerUser = async (
	user: UserRegister,
	dispatch: Dispatch<Action>,
	navigate: (path: string) => void
) => {
	// dispatch(registerStart());
	dispatch(createAction("auth/registerStart")());
	try {
		const res = await axiosInstance.post("/auths/register", user);
		console.log("user register:", res.data);
		dispatch(registerSuccess(res.data));
		navigate("/login");
	} catch (err: unknown) {
		// dispatch(registerFalse());
		dispatch(createAction("auth/registerFalse")());
		const error = err as AxiosError;
		return error.response?.status;
	}
};

export const logoutUser = (dispatch: Dispatch<Action>, navigate: (path: string) => void) => {
	// dispatch(logoutStart());
	dispatch(createAction("auth/logoutStart")());

	try {
		// dispatch(logoutSuccess());
		dispatch(createAction("auth/logoutSuccess")());
		navigate("/home");
	} catch (err) {
		console.log(err);
		dispatch(createAction("auth/logoutFalse")());

		// dispatch(logoutFalse());
	}
};

export const updateUser = async (user: UserUpdate, dispatch: Dispatch<Action>) => {
	try {
		const res = await updateUserProfile(user);
		dispatch(setUserUpdated(res));
	} catch (err) {
		console.log("error", err);
	}
};
