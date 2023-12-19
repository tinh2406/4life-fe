import { useMutation, useQueryClient } from "react-query";
import { addFavoriteAccommodation } from "../api/accommodation.api";
import { toast } from "react-toastify";

const useCreateFavoriteAccommodation = () => {
	const queryClient = useQueryClient();
	return useMutation(addFavoriteAccommodation, {
		onSuccess: () => {
			queryClient.invalidateQueries(["all-rooms"]);
			queryClient.invalidateQueries(["all-favorite-accommodations"]);
			queryClient.invalidateQueries(["all-rooms-by-location"]);
			// toast.success("The accommodation has been added to your favorite list");
		},
		onError: () => {
			toast.error("An error occurred, please try again later");
		}
	});
};

export default useCreateFavoriteAccommodation;
