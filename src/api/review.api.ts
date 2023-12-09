import { Review } from "../types/axios/accommodation-detail";
import { CanReview } from "../types/axios/canReview";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { PagingResponse } from "../types/axios/paging";
import { PostReview } from "../types/model/postReview";
import { axiosInstance } from "./instance";

export const getReviews = async (params: GetRoomsParams, id: number): Promise<PagingResponse<Review>> => {
	const response = await axiosInstance.get<PagingResponse<Review>>(`/reviews/${id}`, {
		params: {
			...params
		}
	});
	return response.data;
};

export const postReview = async (data: PostReview): Promise<Review> => {
	const response = await axiosInstance.post<Review>("/reviews", data);
	return response.data;
};

export const canReview = async (id: number): Promise<CanReview> => {
	const response = await axiosInstance.get(`/reviews/check-review/${id}`);
	return response.data;
};
