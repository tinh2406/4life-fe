export interface Accommodation {
	name: string;
	type: string;
	locationId: number;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	numberOfRooms: number;
	numberOfBeds: number;
	numberOfBedrooms: number;
	numberOfBathrooms: number;
	maxGuests: number;
	price: number;
	imageUrls: string[];
	checkInAfter: string;
	checkInBefore: string;
	checkOutBefore: string;
	isPetAllowed: boolean;
	isSmokingAllowed: boolean;
	isEventAllowed: boolean;
	isPhotoAllowed: boolean;
	quietHoursAfter: string;
	quietHoursBefore: string;
	amenityIds: number[];
}
