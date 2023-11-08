import { GetRoomsParams } from "../types/axios/get-room-params";
import { PagingResponse, RoomResponse } from "../types/axios/paging";
import { axiosInstance } from "./instance";

export const getRooms = async (params: GetRoomsParams): Promise<PagingResponse<RoomResponse>> => {
    const response = await axiosInstance.get<PagingResponse<RoomResponse>>("/accommodations", {
        params: {
            ...params
        }
    });
    return response.data;
};