export interface PagingResponse<T> {
    meta: {
        pageIndex: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
    },
	data: T[];
}

export interface RoomResponse {
    id: number;
    name: string;
    description: string;
    address: string;
    price: number;
    maxGuests: number;
    numberOfRooms: number;
    numberOfBeds: number;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    latitude: number;
    longitude: number;
    checkInAfter: string;
    checkInBefore: string;
    checkOutBefore: string;
    imageUrls: string[];
    isPetAllowed: boolean;
    isSmokingAllowed: boolean;
    isEventsAllowed: boolean;
    isPhotoAllowed: boolean;
    quietHoursAfter: string;
    quietHoursBefore: string;
    type: string;
    location: {
        id: number;
        city: string;
        district: string;
    },
    mod: {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
    },
}
