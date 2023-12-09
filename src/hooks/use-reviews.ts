import { useState } from "react";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { PagingResponse } from "../types/axios/paging";
import { getReviews } from "../api/review.api";
import { Review } from "../types/axios/accommodation-detail";

const LIMIT_ROW_PER_PAGE = 3;

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
	data: PagingResponse<Review>[] | undefined;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<Review>, unknown>>;
};

const useReviews = (id: number): ReturnType => {
	const [params, _setParams] = useState<GetRoomsParams>(initialRequestParams);
	console.log(1);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<Review>,
		unknown,
		PagingResponse<Review>
	>(
		["all-reviews", ...Object.values(params)],
		async ({ pageParam = params.PageIndex }) => {
			return await getReviews({ ...params, PageIndex: pageParam }, id);
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

export default useReviews;
