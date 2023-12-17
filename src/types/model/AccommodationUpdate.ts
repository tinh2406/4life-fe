export interface AccommodationUpdate {
	name: string;
	type: string;
	description: string;
	maxGuests: number;
	price: number;
	checkInAfter: string;
	checkInBefore: string;
	checkOutBefore: string;
	isPetAllowed: boolean;
	isSmokingAllowed: boolean;
	isEventAllowed: boolean;
	isPhotoAllowed: boolean;
	quietHoursAfter: string;
	quietHoursBefore: string;
}
