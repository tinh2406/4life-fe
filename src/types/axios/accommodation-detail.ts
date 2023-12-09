import { LocationResponse } from "./paging";

export interface Review {
    useId: number;
    accommodationId: number;
    comment: string;
    cleanlinessRating: number;
    locationRating: number;
    comfortRating: number;
    amenitiesRating: number;
    createdDate: string;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        avatar: string;
    }
}

export interface AccommodationDetail {
    id: number;
    name: string;
    description: string;
    address: string;
    price: number;
    maxGuests: number;
    numberOfBeds: number;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    latitue: number;
    longtitue: number;
    checkInAfter: string;
    checkInBefore: string;
    checkOutBefore: string;
    imageUrls: string[];
    isPetAllowed: boolean;
    isSmokingAllowed: boolean;
    isEventsAllowed: boolean;
    isPhotoAllowed: boolean;
    quiteHoursAfter: string;
    quiteHoursBefore: string;
    type: string;
    location: LocationResponse;
    mod: {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        avatar: string;
    };
    isFavorite: boolean;
    reviews: Review[];
    totalReview: number;
    avgRating: number;
    avgCleanlinessRating: number;
    avgAmenitiesRating: number;
    avgComfortRating: number;
    avgLocationRating: number;
}