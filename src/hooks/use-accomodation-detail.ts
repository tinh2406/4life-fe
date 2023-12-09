import { useQuery } from "react-query";
import { getAccomodationById } from "../api/accommodation.api";
import { AccommodationDetail } from "../types/axios/accommodation-detail";

type useAccommodationDetailReturnType = {
	isLoading: boolean;
	isError: boolean;
	data: AccommodationDetail | undefined;
};

const useAccommodationDetail = (id: number): useAccommodationDetailReturnType => {

	const { data, isLoading, isError } = useQuery({
		queryKey: ["userAccomodationDetail", id],
		queryFn: () => getAccomodationById(id),
		select(data) {
			return data;
		}
	});

	return {
		isLoading,
		isError,
		data,
	};
};

export default useAccommodationDetail;
