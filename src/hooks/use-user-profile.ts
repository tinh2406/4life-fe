import { useQuery } from "react-query";
import { getUserProfile } from "../api/auth.api";
import { UserProfile } from "../types/axios/user-profile-api";

type UseUserProfileReturnType = {
	isLoading: boolean;
	isError: boolean;
	data: UserProfile | undefined;
};

const useUserProfile = (): UseUserProfileReturnType => {

	const { data, isLoading, isError } = useQuery({
		queryKey: ["userProfiles"],
		queryFn: () => getUserProfile(),
		select(data) {
			return data.data;
		}
	});

	return {
		isLoading,
		isError,
		data,
	};
};

export default useUserProfile;
