import { useQuery } from "react-query";
import { getMyBookings } from "../api/booking.api";
import { BookingDetail } from "../types/axios/booking-detail";

type UseMyBookingsReturnType = {
	isLoading: boolean;
	isError: boolean;
	data: BookingDetail[] | undefined;
};

const useMyBookings = (): UseMyBookingsReturnType => {

	const { data, isLoading, isError } = useQuery({
		queryKey: ["all-my-bookings"],
		queryFn: () => getMyBookings(),
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

export default useMyBookings;
