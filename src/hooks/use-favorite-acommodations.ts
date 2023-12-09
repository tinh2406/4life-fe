import { useState } from "react";
import { RoomResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { PagingResponse } from "../types/axios/paging";
import { getAllFavoriteAccommodation } from "../api/accommodation.api";

const LIMIT_ROW_PER_PAGE = 12;

const initialRequestParams: GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: null
};

type ReturnType = {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	data: PagingResponse<RoomResponse>[] | undefined;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<RoomResponse>, unknown>>;
};

const useFavoriteAccommodations = (): ReturnType => {
	const [params, _setParams] = useState<GetRoomsParams>(initialRequestParams);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<RoomResponse>,
		unknown,
		PagingResponse<RoomResponse>
	>(
		["all-favorite-accommodations", ...Object.values(params)],
		async ({ pageParam = params.PageIndex }) => {
			return await getAllFavoriteAccommodation({ ...params, PageIndex: pageParam });
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

export default useFavoriteAccommodations;
