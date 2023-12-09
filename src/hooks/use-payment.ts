import { useMutation, useQueryClient } from "react-query";
import { addAccommodation } from "../api/accommodation.api";
import { toast } from "react-toastify";

const usePayment = () => {
	const queryClient = useQueryClient();
	return useMutation(addAccommodation, {
		onSuccess: () => {
			queryClient.invalidateQueries("all-my-accomodations");
			toast.success("The accomodation has been created successfully!");
		},
		onError: () => {
			toast.error("An error occurred while creating the accomodation!");
		}
	});
};

export default usePayment;
