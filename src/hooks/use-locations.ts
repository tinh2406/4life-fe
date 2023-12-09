import { useState } from "react";
import { LocationResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { getLocations } from "../api/location.api";
import { PagingResponse } from "../types/axios/paging";

const LIMIT_ROW_PER_PAGE = 12;

const initialRequestParams: GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: "City"
};

type ReturnType = {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	data: PagingResponse<LocationResponse>[] | undefined;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<LocationResponse>, unknown>>;
};

const useLocations = (): ReturnType => {
	const [params, _setParams] = useState<GetRoomsParams>(initialRequestParams);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<LocationResponse>,
		unknown,
		PagingResponse<LocationResponse>
	>(
		["all-locations"],
		async ({ pageParam = params.PageIndex }) => {
			return await getLocations({ ...params, PageIndex: pageParam });
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

export default useLocations;
