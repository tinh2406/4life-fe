import { BookingDetail } from "../types/axios/booking-detail";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { BookingOfMy, PagingResponse } from "../types/axios/paging";
import { Booking } from "../types/model/booking";
import { Payment } from "../types/model/payment";
import { axiosInstance } from "./instance";

export const booking = async (data: Booking) => {
	const response = await axiosInstance.post("/bookings", data);
	return response.data;
};

export const getMyBookings = async (): Promise<BookingDetail[]> => {
	const response = await axiosInstance.get<BookingDetail[]>("/bookings/self-user");
	return response.data;
};

export const getListBookedPostOfMyAccommodation = async (
	params: GetRoomsParams
): Promise<PagingResponse<BookingOfMy>> => {
	const response = await axiosInstance.get<PagingResponse<BookingOfMy>>(`/bookings/self-mod`, {
		params: {
			...params
		}
	});
	return response.data;
};

export const getBookingDetail = async (id: number): Promise<BookingDetail> => {
	const response = await axiosInstance.get<BookingDetail>(`/bookings/${id}`);
	return response.data;
};

export const payment = async (data: Payment): Promise<string> => {
	const response = await axiosInstance.post<string>("/payment", data);
	console.log(response.data);
	return response.data;
};
