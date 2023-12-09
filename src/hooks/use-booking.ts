import { useMutation, useQueryClient } from "react-query";
import { booking } from "../api/booking.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useBooking = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(booking, {
		onSuccess: data => {
			const id = data.id;
			if (id) {
				queryClient.invalidateQueries("all-my-bookings");
				toast.success("Booking successfully!");
				navigate(`/my-bookings/${id}`);
			} else {
				toast.error("No booking ID found in the response.");
			}
		},
		onError: () => {
			toast.error("An error occurred while booking the accomodation!");
		}
	});
};

export default useBooking;
