export interface GetRoomsParams {
	Keyword?: string | null;
	PageIndex: number;
	PageSize: number;
	IsDescending?: boolean;
	SortBy?: string | null;
	locationId?: number;
	type?: string;
	checkIn?: string;
	checkOut?: string;
	MaxGuests?: number;
}
