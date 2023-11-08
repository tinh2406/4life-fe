import { useCallback, useState } from "react";
import { RoomResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { getRooms } from "../api/rooms.api";
import { PagingResponse } from "../types/axios/paging";

const LIMIT_ROW_PER_PAGE = 12;

const initialRequestParams:GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: "Name"
};

type ReturnType = {
	isLoading: boolean;
    isFetching:boolean;
	isError: boolean;
	data: PagingResponse<RoomResponse>[] | undefined;
	handleLocationChange: (value: number) => void;
    fetchNextPage:() => Promise<InfiniteQueryObserverResult<PagingResponse<RoomResponse>, unknown>>
};

const useRooms = (): ReturnType => {
	const [params, setParams] = useState<GetRoomsParams>(initialRequestParams);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<RoomResponse>,
		unknown,
		PagingResponse<RoomResponse>
	>(
        ['all-rooms'],
        async ({ pageParam = params.PageIndex }) => {
            return await getRooms({...params, PageIndex:pageParam})
        },
        {
          getNextPageParam: (lastPage) => lastPage.meta.pageIndex + 1,
        },
      )

    const handleLocationChange = useCallback((value: number): void => {
		setParams((state: GetRoomsParams) => ({ ...state, locationId: value, PageIndex: 1 }));
	}, []);

	// const handleSearchChange = useCallback((searchTerm: string) => {
	// 	setParams(state => ({ ...state, keyword: searchTerm, pageIndex: 1 }));
	// }, []);

	return {
		isLoading,
		isError,
        isFetching,
		data: data?.pages,
		// handleSearchChange,
        handleLocationChange,
        fetchNextPage
	};
};

export default useRooms;
