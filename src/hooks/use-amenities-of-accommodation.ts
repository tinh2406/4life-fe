import { useState } from "react";
import { AmenitiesAccommodationResponse } from "../types/axios/paging";
import { GetRoomsParams } from "../types/axios/get-room-params";
import { InfiniteQueryObserverResult, useInfiniteQuery } from "react-query";
import { getAmenitiesByIdAccommodation } from "../api/amenity.api";
import { PagingResponse } from "../types/axios/paging";

const LIMIT_ROW_PER_PAGE = 10;

const initialRequestParams:GetRoomsParams = {
	Keyword: null,
	PageIndex: 1,
	PageSize: LIMIT_ROW_PER_PAGE,
	IsDescending: false,
	SortBy: null
};

type ReturnType = {
	isLoading: boolean;
    isFetching:boolean;
	isError: boolean;
	data: PagingResponse<AmenitiesAccommodationResponse>[] | undefined;
    fetchNextPage:() => Promise<InfiniteQueryObserverResult<PagingResponse<AmenitiesAccommodationResponse>, unknown>>
};

const useAmenitiesOfAccommodation = (id: number): ReturnType => {
	const [params, setParams] = useState<GetRoomsParams>(initialRequestParams);

	const { data, isLoading, isFetching, isError, fetchNextPage } = useInfiniteQuery<
		PagingResponse<AmenitiesAccommodationResponse>,
		unknown,
		PagingResponse<AmenitiesAccommodationResponse>
	>(
        ['all-amenities-of-accommodation'],
        async ({ pageParam = params.PageIndex }) => {
            return await getAmenitiesByIdAccommodation({...params, PageIndex:pageParam}, id)
        },
        {
          getNextPageParam: (lastPage) => lastPage.meta.pageIndex + 1,
        },
      )


	return {
		isLoading,
		isError,
        isFetching,
		data: data?.pages,
        fetchNextPage
	};
};

export default useAmenitiesOfAccommodation;
