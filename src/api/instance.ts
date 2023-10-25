import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
	baseURL:"https://dctt.azurewebsites.net/api",
	headers: {
		"Content-Type": "application/json"
	}
});

export default axiosInstance; 
