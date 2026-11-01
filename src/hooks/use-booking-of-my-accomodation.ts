import { BookingOfMy } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { PagingResponse } from "../types/axios/paging";
import { getListBookedPostOfMyAccommodation } from "../api/booking.api";

const LIMIT_ROW_PER_PAGE = 12;

const initialRequestParams: GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: "CreatedDate"
};

type ReturnType = {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	data: PagingResponse<BookingOfMy>[] | undefined;
	// handleLocationChange: (value: number) => void;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<BookingOfMy>, unknown>>;
};

const useBookingOfMyAccomodations = (): ReturnType => {
	const params = initialRequestParams;

	const { data, isLoading, isFetching, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
		PagingResponse<BookingOfMy>,
		unknown,
		PagingResponse<BookingOfMy>
	>(
		["all-booking-of-my-accomodations"],
		async ({ pageParam = params.PageIndex }) => {
			return await getListBookedPostOfMyAccommodation({ ...params, PageIndex: pageParam });
		},
		{
			getNextPageParam: lastPage =>
				lastPage.meta.pageIndex < lastPage.meta.totalPages ? lastPage.meta.pageIndex + 1 : undefined
		}
	);

	// const handleLocationChange = useCallback((value: number): void => {
	// 	setParams((state: GetRoomsParams) => ({ ...state, locationId: value, PageIndex: 1 }));
	// }, []);

	// const handleSearchChange = useCallback((searchTerm: string) => {
	// 	setParams(state => ({ ...state, keyword: searchTerm, pageIndex: 1 }));
	// }, []);

	return {
		isLoading,
		isError,
		isFetching,
		hasNextPage: Boolean(hasNextPage),
		isFetchingNextPage,
		data: data?.pages,
		// handleLocationChange,
		fetchNextPage
	};
};

export default useBookingOfMyAccomodations;
