import { useQuery } from "react-query";
import { getBookingDetail } from "../api/booking.api";
import { BookingDetail } from "../types/axios/booking-detail";

type useBookingDetailReturnType = {
	isLoading: boolean;
	isError: boolean;
	data: BookingDetail | undefined;
};

const useBookingDetail = (id: number): useBookingDetailReturnType => {

	const { data, isLoading, isError } = useQuery({
		queryKey: ["booking-detail", id],
		queryFn: () => getBookingDetail(id),
		select(data) {
			return data;
		}
	});

	return {
		isLoading,
		isError,
		data,
	};
};

export default useBookingDetail;
