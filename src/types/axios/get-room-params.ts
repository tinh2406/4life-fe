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

export interface GuestOption {
	value: number;
	label: string;
}

export const GUEST_OPTIONS: GuestOption[] = [
	{ value: 0, label: "Any number" },
	{ value: 1, label: "1 guest" },
	{ value: 2, label: "2 guests" },
	{ value: 3, label: "3 guests" },
	{ value: 4, label: "4 guests" },
	{ value: 5, label: "5 guests" },
	{ value: 6, label: "6 guests" },
	{ value: 7, label: "7 guests" },
	{ value: 8, label: "8 guests" },
	{ value: 10, label: "10+ guests" },
	{ value: 12, label: "12+ guests" },
	{ value: 16, label: "16+ guests" }
];
