import { AccommodationDetail, Review } from "../types/axios/accommodation-detail";
import { BookingDetail } from "../types/axios/booking-detail";
import { UserProfile } from "../types/axios/user-profile-api";
import { AmenityResponse, LocationResponse, RoomResponse } from "../types/axios/paging";

export const mockUser: UserProfile = {
	id: "mock-user-1", name: "Alex Morgan", email: "demo@4life.test", phoneNumber: "+1 555 0100",
	avatar: "https://i.pravatar.cc/150?img=12", dateOfBirth: "1995-04-12", gender: true,
	description: "", frontIdentityCard: "", backIdentityCard: "", statusModRole: "Approved"
};

export const mockLocations: LocationResponse[] = [
	{ id: 1, city: "Da Nang", district: "Hai Chau" },
	{ id: 2, city: "Da Nang", district: "Son Tra" },
	{ id: 3, city: "Ha Noi", district: "Ba Dinh" },
	{ id: 4, city: "Ho Chi Minh City", district: "District 1" }
];

export const mockAmenities: AmenityResponse[] = [
	{ id: 1, name: "Wi-Fi", icon: "wifi" }, { id: 2, name: "Air conditioning", icon: "ac_unit" },
	{ id: 3, name: "Kitchen", icon: "kitchen" }, { id: 4, name: "Swimming pool", icon: "pool" },
	{ id: 5, name: "Parking", icon: "local_parking" }, { id: 6, name: "Washer", icon: "local_laundry_service" }
];

const host = { id: 2, name: "Linh Tran", email: "host@4life.test", phoneNumber: "+84 900 000 001", avatar: "https://i.pravatar.cc/150?img=47" };
const images = ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"];

export const mockRooms: RoomResponse[] = [
	{ id: 1, name: "Sunny apartment near the beach", address: "12 Vo Nguyen Giap, Son Tra", price: 72, maxGuests: 4, latitude: 16.06, longitude: 108.24, imageUrls: images, type: "Apartment", location: mockLocations[1], mod: host, isFavorite: false, totalReviews: 18, avgRating: 4.8 },
	{ id: 2, name: "Quiet home in the city center", address: "8 Bach Dang, Hai Chau", price: 55, maxGuests: 2, latitude: 16.07, longitude: 108.22, imageUrls: images, type: "House", location: mockLocations[0], mod: host, isFavorite: true, totalReviews: 12, avgRating: 4.6 },
	{ id: 3, name: "Modern studio with a view", address: "25 Tran Phu, Hai Chau", price: 48, maxGuests: 2, latitude: 16.08, longitude: 108.22, imageUrls: images, type: "Apartment", location: mockLocations[0], mod: host, isFavorite: false, totalReviews: 9, avgRating: 4.7 },
	{ id: 4, name: "Garden villa with pool", address: "34 Ho Nghinh, Son Tra", price: 130, maxGuests: 6, latitude: 16.09, longitude: 108.25, imageUrls: images, type: "Villa", location: mockLocations[1], mod: host, isFavorite: false, totalReviews: 21, avgRating: 4.9 }
];

export const mockReviews: Review[] = [{
	useId: 12, accommodationId: 1, comment: "A lovely, clean place in a great location.", cleanlinessRating: 5,
	locationRating: 5, comfortRating: 5, amenitiesRating: 4, createdDate: "2025-05-14T09:00:00Z", user: mockUser
}];

export const mockAccommodations: AccommodationDetail[] = mockRooms.map(room => ({
	...room, description: "A comfortable, well-equipped place to enjoy your stay in Da Nang.", maxGuests: 4,
	numberOfBeds: 2, numberOfBedrooms: 2, numberOfBathrooms: 1, checkInAfter: "14:00", checkInBefore: "22:00",
	checkOutBefore: "11:00", isPetAllowed: false, isSmokingAllowed: false, isEventAllowed: false, isPhotoAllowed: true,
	quietHoursAfter: "22:00", quietHoursBefore: "07:00", reviews: mockReviews, totalReview: room.totalReviews,
	avgCleanlinessRating: 4.8, avgAmenitiesRating: 4.6, avgComfortRating: 4.7, avgLocationRating: 4.9
}));

export const mockBookings: BookingDetail[] = [{
	id: 101, checkInDate: "2026-11-12", checkOutDate: "2026-11-15", totalPrice: 216, isPaid: false,
	createDate: "2026-10-20T09:00:00Z", userSummaryDto: { id: 1, name: mockUser.name, email: mockUser.email, phoneNumber: mockUser.phoneNumber, avatar: mockUser.avatar },
	accommodation: { ...mockRooms[0], description: "A comfortable, well-equipped place to enjoy your stay in Da Nang.", distance: 1.2, checkInAfter: "14:00", checkInBefore: "22:00", checkOutBefore: "11:00" }
}];
