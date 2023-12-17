import { useMutation, useQueryClient } from "react-query";
import { postReview } from "../api/review.api";
import { toast } from "react-toastify";

const usePostReview = (id: number) => {
	const queryClient = useQueryClient();
	return useMutation(postReview, {
		onSuccess: () => {
			queryClient.invalidateQueries(["all-reviews"]);
			queryClient.invalidateQueries(["userAccomodationDetail", id]);
		},
		onError: () => {
			toast.error("An error occurred, please try again later");
		}
	});
};

export default usePostReview;
