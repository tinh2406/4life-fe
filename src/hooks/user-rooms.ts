import { useCallback, useState } from "react";
import { RoomResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { getRooms } from "../api/rooms.api";
import { PagingResponse } from "../types/axios/paging";
import { useSearchParams } from "react-router-dom";

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
	data: PagingResponse<RoomResponse>[] | undefined;
	handleTypeChange: (value: string) => void;
	handleLocationChange: (value: number) => void;
	handleCheckInChange: (value: string) => void;
	handleCheckOutChange: (value: string) => void;
	handleMaxGuestsChange: (value: number) => void;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<RoomResponse>, unknown>>;
};

const useRooms = (): ReturnType => {
	const [searchParams] = useSearchParams();
	const [params, setParams] = useState<GetRoomsParams>(() => ({
		...initialRequestParams,
		locationId: Number(searchParams.get("locationId")) || undefined,
		checkIn: searchParams.get("checkIn") || undefined,
		checkOut: searchParams.get("checkOut") || undefined,
		MaxGuests: Number(searchParams.get("MaxGuests")) || undefined
	}));

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<RoomResponse>,
		unknown,
		PagingResponse<RoomResponse>
	>(
		["all-rooms", ...Object.values(params)],
		async ({ pageParam = params.PageIndex }) => {
			return await getRooms({ ...params, PageIndex: pageParam });
		},
		{
			getNextPageParam: lastPage => lastPage.meta.pageIndex + 1
		}
	);

	const handleLocationChange = useCallback((value: number): void => {
		setParams((state: GetRoomsParams) => ({ ...state, locationId: value, PageIndex: 1 }));
	}, []);

	const handleTypeChange = useCallback((value: string): void => {
		setParams((state: GetRoomsParams) => ({ ...state, type: value, PageIndex: 1 }));
	}, []);

	const handleCheckInChange = useCallback((value: string): void => {
		setParams((state: GetRoomsParams) => ({ ...state, checkIn: value, PageIndex: 1 }));
	}, []);

	const handleCheckOutChange = useCallback((value: string): void => {
		setParams((state: GetRoomsParams) => ({ ...state, checkOut: value, PageIndex: 1 }));
	}, []);

	const handleMaxGuestsChange = useCallback((value: number): void => {
		setParams((state: GetRoomsParams) => ({ ...state, MaxGuests: value, PageIndex: 1 }));
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
		handleTypeChange,
		handleLocationChange,
		handleCheckInChange,
		handleCheckOutChange,
		handleMaxGuestsChange,
		fetchNextPage
	};
};

export default useRooms;
