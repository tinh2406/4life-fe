import { GetRoomsParams } from "../types/axios/get-room-params";
import { PagingResponse, LocationResponse } from "../types/axios/paging";
import { axiosInstance } from "./instance";

export const getLocations = async (params: GetRoomsParams): Promise<PagingResponse<LocationResponse>> => {
    const response = await axiosInstance.get<PagingResponse<LocationResponse>>("/locations", {
        params: {
            ...params
        }
    });
    return response.data;
};