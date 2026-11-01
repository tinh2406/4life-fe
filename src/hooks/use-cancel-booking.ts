import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cancelBooking } from "../api/booking.api";

const useCancelBooking = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(cancelBooking, {
		onSuccess: async (_data, bookingId) => {
			queryClient.removeQueries(["booking-detail", bookingId]);
			await queryClient.invalidateQueries(["all-my-bookings"]);
			toast.success("Booking cancelled.");
			navigate("/my-bookings", { replace: true });
		},
		onError: () => {
			toast.error("Could not cancel this booking. Please try again.");
		}
	});
};

export default useCancelBooking;
