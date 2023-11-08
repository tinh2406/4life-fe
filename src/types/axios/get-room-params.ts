export interface GetRoomsParams {
	Keyword?: string | null;
	PageIndex: number;
	PageSize: number;
	IsDescending?: boolean;
	SortBy?: string;
}