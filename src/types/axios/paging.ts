export interface PagingResponse<T> {
	meta: {
		pageIndex: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
	};
	data: T[];
}

export interface BookingOfMy {
	//booking bài của mình đăng
	id: number;
	checkInDate: string;
	checkOutDate: string;
	totalPrice: number;
	isPaid: boolean;
	createdDate: string;
	userSummaryDto: {
		id: string;
		name: string;
		email: string;
		phoneNumber: string;
		avatar: string;
	};
	accommodation: {
		id: number;
		name: string;
		address: string;
		price: number;
		latitude: number;
		longitude: number;
		imageUrls: string[];
		type: string;
		location: {
			id: number;
			city: string;
			district: string;
		};
		mod: {
			id: string;
			name: string;
			email: string;
			phoneNumber: string;
			avatar: string;
		};
		isFavorite: boolean;
		totalReviews: number;
		avgRating: number;
		distance: number;
		checkInAfter: string;
		checkInBefore: string;
		checkOutBefore: string;
	};
}

export interface AmenityResponse {
	id: number;
	name: string;
	icon: string;
}

export interface AmenitiesAccommodationResponse {
	accommodationId: number;
	amenities: AmenityResponse[];
}

export interface LocationResponse {
	id: number;
	city: string;
	district: string;
}

export interface RoomResponse {
	id: number;
	name: string;
	address: string;
	price: number;
	latitude: number;
	longitude: number;
	imageUrls: string[];
	type: string;
	location: {
		id: number;
		city: string;
		district: string;
	};
	mod: {
		id: number;
		name: string;
		email: string;
		phoneNumber: string;
		avatar: string;
	};
	isFavorite: boolean;
	totalReviews: number;
	avgRating: number;
}
