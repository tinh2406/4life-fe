export interface Accommodation {
    name: string;
    type: string;
    locationId: number;
    description: string;
    address: string;
    latitue: number;
    longtitue: number;
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
    isEventsAllowed: boolean;
    isPhotoAllowed: boolean;
    quiteHoursAfter: string;
    quiteHoursBefore: string;
    amenityIds: number[];
}