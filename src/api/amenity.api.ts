import { GetRoomsParams } from "../types/axios/get-room-params";
import { PagingResponse, AmenityResponse, AmenitiesAccommodationResponse } from "../types/axios/paging";
import { AmentitiesUpdate } from "../types/model/amentitiesUpdate";
import { axiosInstance } from "./instance";

export const getAmenities = async (params: GetRoomsParams): Promise<PagingResponse<AmenityResponse>> => {
	const response = await axiosInstance.get<PagingResponse<AmenityResponse>>("/amenities", {
		params: {
			...params
		}
	});
	return response.data;
};

export const getAmenitiesByIdAccommodation = async (
	params: GetRoomsParams,
	id: number
): Promise<PagingResponse<AmenitiesAccommodationResponse>> => {
	const response = await axiosInstance.get<PagingResponse<AmenitiesAccommodationResponse>>(
		`/accommodation/amenities/${id}`,
		{
			params: {
				...params
			}
		}
	);
	return response.data;
};

export const updateAmentitiesAccommodation = async (data: AmentitiesUpdate) => {
	const response = await axiosInstance.put(`/accommodation/amenities`, data);
	return response.data;
};
