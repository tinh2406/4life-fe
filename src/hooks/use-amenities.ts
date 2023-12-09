import { useState } from "react";
import { AmenityResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { getAmenities } from "../api/amenity.api";
import { PagingResponse } from "../types/axios/paging";

const LIMIT_ROW_PER_PAGE = 12;

const initialRequestParams: GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: "Name"
};

type ReturnType = {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	data: PagingResponse<AmenityResponse>[] | undefined;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<AmenityResponse>, unknown>>;
};

const useAmenities = (): ReturnType => {
	const [params, _setParams] = useState<GetRoomsParams>(initialRequestParams);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<AmenityResponse>,
		unknown,
		PagingResponse<AmenityResponse>
	>(
		["all-amenities"],
		async ({ pageParam = params.PageIndex }) => {
			return await getAmenities({ ...params, PageIndex: pageParam });
		},
		{
			getNextPageParam: lastPage => lastPage.meta.pageIndex + 1
		}
	);

	return {
		isLoading,
		isError,
		isFetching,
		data: data?.pages,
		fetchNextPage
	};
};

export default useAmenities;
