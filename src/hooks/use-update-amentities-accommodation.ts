import { useMutation, useQueryClient } from "react-query";
import { updateAmentitiesAccommodation } from "../api/amenity.api";

const useUpdateAmentitiesAccommodation = () => {
	const queryClient = useQueryClient();
	return useMutation(updateAmentitiesAccommodation, {
		onSuccess: () => {
			queryClient.invalidateQueries("all-my-accomodations");
		}
	});
};

export default useUpdateAmentitiesAccommodation;
