import { useMutation, useQueryClient } from "react-query";
import { updateAccommodation } from "../api/accommodation.api";
import { toast } from "react-toastify";
import { AccommodationUpdate } from "../types/model/AccommodationUpdate";

const useUpdateAccommodation = () => {
	const queryClient = useQueryClient();
	return useMutation(
		(variables: { idAccommodation: number; accomodationUpdate: AccommodationUpdate }) =>
			updateAccommodation(variables.idAccommodation, variables.accomodationUpdate),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("all-my-accomodations");
				toast.success("The information of the acommodation has been updated successfully!");
			},
			onError: () => {
				toast.error("An error occurred while updating the acommodation!");
			}
		}
	);
};

export default useUpdateAccommodation;
