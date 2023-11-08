import { useMutation, useQueryClient } from "react-query";
import { updateUserProfile} from "../api/auth.api";
import { toast } from "react-toastify";

const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();
	return useMutation(updateUserProfile, {
		onSuccess: () => {
			queryClient.invalidateQueries("user");
			toast.success("The information of user has been updated successfully!");
		},
		onError: () => {
			toast.error("An error occurred while updating the user!");
		}
	});
};

export default useUpdateUserProfile;
