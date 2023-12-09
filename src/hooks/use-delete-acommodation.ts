import { useMutation, useQueryClient } from "react-query";
import { deleteAccommodation } from "../api/accommodation.api";
import { toast } from "react-toastify";

const useDeleteAccommodation = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteAccommodation, {
		onSuccess: async () => {
			await queryClient.invalidateQueries("all-my-accomodations");
			toast.success("The accommodation deleted successfully");
		},
		onError: () => {
			toast.error("An error occurred while deleting the accommodation!");
		}
	});
};

export default useDeleteAccommodation;
