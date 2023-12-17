import { useEffect, useState } from "react";
import { RoomResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { getRooms } from "../api/rooms.api";
import { PagingResponse } from "../types/axios/paging";

const LIMIT_ROW_PER_PAGE = 12;

const initialRequestParams: GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: "Distance"
};

type ReturnType = {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	data: PagingResponse<RoomResponse>[] | undefined;
	fetchNextPage: () => Promise<InfiniteQueryObserverResult<PagingResponse<RoomResponse>, unknown>>;
};

const useRoomsByLocation = (): ReturnType => {
	const [params, setParams] = useState<GetRoomsParams>(initialRequestParams);

	// Gọi hàm để lấy vị trí hiện tại khi cần thiết
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
				setParams((state: GetRoomsParams) => ({
					...state,
					Latitude: latitude,
					Longitude: longitude,
					PageIndex: 1
				}));
			});
		} else {
			// Trình duyệt không hỗ trợ Geolocation API
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<RoomResponse>,
		unknown,
		PagingResponse<RoomResponse>
	>(
		["all-rooms-by-location", ...Object.values(params)],
		async ({ pageParam = params.PageIndex }) => {
			return await getRooms({ ...params, PageIndex: pageParam });
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

export default useRoomsByLocation;
