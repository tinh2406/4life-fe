import axios, { AxiosInstance } from "axios";
import { store } from "../store";
import { logoutSuccess } from "../store/authSlice";

export const axiosInstance: AxiosInstance = axios.create({
	baseURL:"https://tuna.whitemage.tech/api",
  // baseURL: "https://tuna-1.whitemage.tech/api",
	headers: {
		"Content-Type": "application/json"
	}
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken") ;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logoutSuccess());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

export const axiosInstanceFormData : AxiosInstance = axios.create({
	baseURL:"https://tuna.whitemage.tech/api",
  // baseURL: "https://tuna-1.whitemage.tech/api",
	headers: {
		'Content-Type': 'multipart/form-data'
	}
});
