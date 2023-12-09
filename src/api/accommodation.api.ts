import { AccommodationDetail } from "../types/axios/accommodation-detail";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { PagingResponse, RoomResponse } from "../types/axios/paging";
import { AccommodationUpdate } from "../types/model/AccommodationUpdate";
import { Accommodation } from "../types/model/accommodation";
import { Favorite } from "../types/model/favorite";
import { axiosInstance } from "./instance";

export const addAccommodation = async (data: Accommodation) => {
	return await axiosInstance.post("/accommodations", data);
};

export const getAccomodationsOfMy = async (params: GetRoomsParams): Promise<PagingResponse<RoomResponse>> => {
	const response = await axiosInstance.get<PagingResponse<RoomResponse>>("/accommodations/self", {
		params: {
			...params
		}
	});
	return response.data;
};

export const getAccomodationById = async (id: number): Promise<AccommodationDetail> => {
	const response = await axiosInstance.get<AccommodationDetail>(`/accommodations/${id}`);
	return response.data;
};

export const addFavoriteAccommodation = async (data: Favorite) => {
	return await axiosInstance.post("/favorites", data);
};

export const getAllFavoriteAccommodation = async (params: GetRoomsParams): Promise<PagingResponse<RoomResponse>> => {
	const response = await axiosInstance.get<PagingResponse<RoomResponse>>("/favorites", {
		params: {
			...params
		}
	});
	return response.data;
};

export const deleteAccommodation = async (id: number) => {
	return await axiosInstance.delete(`/accommodations/${id}`);
};

export const updateAccommodation = async (id: number, data: AccommodationUpdate) => {
	const response = await axiosInstance.put<AccommodationUpdate>(`/accommodations/${id}`, data);
	return response.data;
};
