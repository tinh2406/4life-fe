import { LocationResponse } from "./paging";

export interface BookingDetail {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    isPaid: boolean;
    createDate: string;
    userSummaryDto: {
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        avatar: string;
    },
    accommodation: {
        id: number;
        name: string;
        description: string;
        address: string;
        price: number;
        latitude: number;
        longitude: number;
        imageUrls: string[];
        type: string;
        location: LocationResponse
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
        distance: number;
        checkInAfter: string;
        checkInBefore: string;
        checkOutBefore: string;
    }
}