import { AccommodationDetail, Review } from "../types/axios/accommodation-detail";
import { BookingDetail } from "../types/axios/booking-detail";
import { UserProfile } from "../types/axios/user-profile-api";
import { AmenityResponse, LocationResponse, RoomResponse } from "../types/axios/paging";

export const mockUser: UserProfile = {
	id: "mock-user-1",
	name: "Alex Morgan",
	email: "demo@4life.test",
	phoneNumber: "+1 555 0100",
	avatar: "https://i.pravatar.cc/150?img=12",
	dateOfBirth: "1995-04-12",
	gender: true,
	description: "Traveler and design enthusiast enjoying life in Vietnam.",
	frontIdentityCard: "",
	backIdentityCard: "",
	statusModRole: "Approved"
};

export const mockLocations: LocationResponse[] = [
	{ id: 1, city: "Da Nang", district: "Hai Chau" },
	{ id: 2, city: "Da Nang", district: "Son Tra" },
	{ id: 3, city: "Da Nang", district: "Ngu Hanh Son" },
	{ id: 4, city: "Hoi An", district: "Minh An" },
	{ id: 5, city: "Hoi An", district: "Cam Chau" },
	{ id: 6, city: "Ha Noi", district: "Hoan Kiem" },
	{ id: 7, city: "Ha Noi", district: "Ba Dinh" },
	{ id: 8, city: "Ha Noi", district: "Tay Ho" },
	{ id: 9, city: "Ho Chi Minh City", district: "District 1" },
	{ id: 10, city: "Ho Chi Minh City", district: "District 3" },
	{ id: 11, city: "Da Lat", district: "Ward 10" },
	{ id: 12, city: "Nha Trang", district: "Loc Tho" },
	{ id: 13, city: "Phu Quoc", district: "Duong Dong" }
];

export const mockAmenities: AmenityResponse[] = [
	{ id: 1, name: "Wi-Fi", icon: "wifi" },
	{ id: 2, name: "Air conditioning", icon: "ac_unit" },
	{ id: 3, name: "Kitchen", icon: "kitchen" },
	{ id: 4, name: "Swimming pool", icon: "pool" },
	{ id: 5, name: "Parking", icon: "local_parking" },
	{ id: 6, name: "Washer", icon: "local_laundry_service" },
	{ id: 7, name: "Balcony", icon: "balcony" },
	{ id: 8, name: "Gym", icon: "fitness_center" }
];

const hosts = [
	{ id: 2, name: "Linh Tran", email: "linh.tran@4life.test", phoneNumber: "+84 900 000 001", avatar: "https://i.pravatar.cc/150?img=47" },
	{ id: 3, name: "Minh Nguyen", email: "minh.nguyen@4life.test", phoneNumber: "+84 900 000 002", avatar: "https://i.pravatar.cc/150?img=33" },
	{ id: 4, name: "Ha Vo", email: "ha.vo@4life.test", phoneNumber: "+84 900 000 003", avatar: "https://i.pravatar.cc/150?img=25" },
	{ id: 5, name: "Quoc Bao", email: "bao.quoc@4life.test", phoneNumber: "+84 900 000 004", avatar: "https://i.pravatar.cc/150?img=68" }
];

const photos = {
	coastalApartment: [
		"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
		"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
		"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"
	],
	luxuryVilla: [
		"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
		"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
		"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200"
	],
	cozyHomestay: [
		"https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200",
		"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200",
		"https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200"
	],
	cityStudio: [
		"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
		"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
		"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200"
	],
	heritageHouse: [
		"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
		"https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200",
		"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200"
	],
	beachfrontResort: [
		"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
		"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
		"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200"
	]
};

export const mockRooms: RoomResponse[] = [
	// Da Nang - Hai Chau
	{
		id: 1,
		name: "Riverside Studio with Dragon Bridge View",
		address: "15 Tran Phu, Hai Chau",
		price: 45,
		maxGuests: 2,
		latitude: 16.068,
		longitude: 108.223,
		imageUrls: photos.cityStudio,
		type: "Apartment",
		location: mockLocations[0],
		mod: hosts[0],
		isFavorite: false,
		totalReviews: 24,
		avgRating: 4.8
	},
	{
		id: 2,
		name: "Quiet Minimalist Home in City Center",
		address: "8 Bach Dang, Hai Chau",
		price: 55,
		maxGuests: 4,
		latitude: 16.072,
		longitude: 108.225,
		imageUrls: photos.heritageHouse,
		type: "House",
		location: mockLocations[0],
		mod: hosts[0],
		isFavorite: true,
		totalReviews: 19,
		avgRating: 4.7
	},
	{
		id: 3,
		name: "Chic Loft near Han Market",
		address: "42 Hung Vuong, Hai Chau",
		price: 38,
		maxGuests: 2,
		latitude: 16.069,
		longitude: 108.219,
		imageUrls: photos.coastalApartment,
		type: "Homestay",
		location: mockLocations[0],
		mod: hosts[1],
		isFavorite: false,
		totalReviews: 31,
		avgRating: 4.9
	},

	// Da Nang - Son Tra
	{
		id: 4,
		name: "Sunny Penthouse by My Khe Beach",
		address: "12 Vo Nguyen Giap, Son Tra",
		price: 85,
		maxGuests: 4,
		latitude: 16.061,
		longitude: 108.246,
		imageUrls: photos.coastalApartment,
		type: "Apartment",
		location: mockLocations[1],
		mod: hosts[0],
		isFavorite: false,
		totalReviews: 42,
		avgRating: 4.9
	},
	{
		id: 5,
		name: "Ocean Breeze Garden Villa with Pool",
		address: "34 Ho Nghinh, Son Tra",
		price: 140,
		maxGuests: 6,
		latitude: 16.075,
		longitude: 108.243,
		imageUrls: photos.luxuryVilla,
		type: "Villa",
		location: mockLocations[1],
		mod: hosts[2],
		isFavorite: false,
		totalReviews: 28,
		avgRating: 4.9
	},
	{
		id: 6,
		name: "Cozy Coastal Homestay",
		address: "78 Pham Van Dong, Son Tra",
		price: 32,
		maxGuests: 2,
		latitude: 16.071,
		longitude: 108.239,
		imageUrls: photos.cozyHomestay,
		type: "Homestay",
		location: mockLocations[1],
		mod: hosts[1],
		isFavorite: true,
		totalReviews: 15,
		avgRating: 4.6
	},

	// Da Nang - Ngu Hanh Son
	{
		id: 7,
		name: "Marble Mountain Luxury Retreat Villa",
		address: "55 Le Van Hien, Ngu Hanh Son",
		price: 160,
		maxGuests: 8,
		latitude: 16.028,
		longitude: 108.258,
		imageUrls: photos.luxuryVilla,
		type: "Villa",
		location: mockLocations[2],
		mod: hosts[3],
		isFavorite: false,
		totalReviews: 14,
		avgRating: 5.0
	},
	{
		id: 8,
		name: "Non Nuoc Beachside Bungalow",
		address: "10 Truong Sa, Ngu Hanh Son",
		price: 68,
		maxGuests: 3,
		latitude: 16.015,
		longitude: 108.265,
		imageUrls: photos.beachfrontResort,
		type: "Homestay",
		location: mockLocations[2],
		mod: hosts[2],
		isFavorite: false,
		totalReviews: 22,
		avgRating: 4.7
	},

	// Hoi An
	{
		id: 9,
		name: "Heritage Courtyard Homestay",
		address: "18 Tran Phu, Minh An",
		price: 42,
		maxGuests: 2,
		latitude: 15.877,
		longitude: 108.328,
		imageUrls: photos.cozyHomestay,
		type: "Homestay",
		location: mockLocations[3],
		mod: hosts[1],
		isFavorite: true,
		totalReviews: 56,
		avgRating: 4.9
	},
	{
		id: 10,
		name: "An Bang Coconut Palms Private Villa",
		address: "88 Lac Long Quan, Cam Chau",
		price: 110,
		maxGuests: 6,
		latitude: 15.912,
		longitude: 108.339,
		imageUrls: photos.luxuryVilla,
		type: "Villa",
		location: mockLocations[4],
		mod: hosts[2],
		isFavorite: false,
		totalReviews: 37,
		avgRating: 4.8
	},
	{
		id: 11,
		name: "Riverside Lantern Townhouse",
		address: "22 Nguyen Tri Phuong, Cam Chau",
		price: 58,
		maxGuests: 4,
		latitude: 15.882,
		longitude: 108.341,
		imageUrls: photos.heritageHouse,
		type: "House",
		location: mockLocations[4],
		mod: hosts[0],
		isFavorite: false,
		totalReviews: 29,
		avgRating: 4.7
	},

	// Ha Noi
	{
		id: 12,
		name: "Old Quarter French Balcony Suite",
		address: "14 Hang Bac, Hoan Kiem",
		price: 62,
		maxGuests: 3,
		latitude: 21.034,
		longitude: 105.852,
		imageUrls: photos.cityStudio,
		type: "Apartment",
		location: mockLocations[5],
		mod: hosts[3],
		isFavorite: false,
		totalReviews: 63,
		avgRating: 4.8
	},
	{
		id: 13,
		name: "Tranquil West Lake Studio",
		address: "68 Tu Hoa, Tay Ho",
		price: 50,
		maxGuests: 2,
		latitude: 21.062,
		longitude: 105.827,
		imageUrls: photos.coastalApartment,
		type: "Apartment",
		location: mockLocations[7],
		mod: hosts[1],
		isFavorite: false,
		totalReviews: 45,
		avgRating: 4.9
	},
	{
		id: 14,
		name: "Ba Dinh Botanical Garden Home",
		address: "29 Phan Dinh Phung, Ba Dinh",
		price: 75,
		maxGuests: 4,
		latitude: 21.041,
		longitude: 105.839,
		imageUrls: photos.heritageHouse,
		type: "House",
		location: mockLocations[6],
		mod: hosts[2],
		isFavorite: false,
		totalReviews: 21,
		avgRating: 4.7
	},
	{
		id: 15,
		name: "Traditional Hanoi Courtyard Homestay",
		address: "5 Chau Long, Ba Dinh",
		price: 36,
		maxGuests: 2,
		latitude: 21.045,
		longitude: 105.842,
		imageUrls: photos.cozyHomestay,
		type: "Homestay",
		location: mockLocations[6],
		mod: hosts[0],
		isFavorite: false,
		totalReviews: 34,
		avgRating: 4.8
	},

	// Ho Chi Minh City
	{
		id: 16,
		name: "Modern Skyline Loft in District 1",
		address: "102 Nguyen Hue, District 1",
		price: 92,
		maxGuests: 4,
		latitude: 10.774,
		longitude: 106.703,
		imageUrls: photos.coastalApartment,
		type: "Apartment",
		location: mockLocations[8],
		mod: hosts[3],
		isFavorite: true,
		totalReviews: 78,
		avgRating: 4.9
	},
	{
		id: 17,
		name: "Artisan Alley Boutique Homestay",
		address: "45 Vo Van Tan, District 3",
		price: 40,
		maxGuests: 2,
		latitude: 10.778,
		longitude: 106.691,
		imageUrls: photos.cozyHomestay,
		type: "Homestay",
		location: mockLocations[9],
		mod: hosts[1],
		isFavorite: false,
		totalReviews: 39,
		avgRating: 4.8
	},
	{
		id: 18,
		name: "Saigon River Oasis Luxury Villa",
		address: "18 Ton Duc Thang, District 1",
		price: 175,
		maxGuests: 6,
		latitude: 10.776,
		longitude: 106.707,
		imageUrls: photos.luxuryVilla,
		type: "Villa",
		location: mockLocations[8],
		mod: hosts[2],
		isFavorite: false,
		totalReviews: 27,
		avgRating: 5.0
	},

	// Da Lat
	{
		id: 19,
		name: "Pine Forest Wooden Cabin",
		address: "17 Khoi Nghia Bac Son, Ward 10",
		price: 48,
		maxGuests: 3,
		latitude: 11.932,
		longitude: 108.452,
		imageUrls: photos.cozyHomestay,
		type: "Homestay",
		location: mockLocations[10],
		mod: hosts[1],
		isFavorite: true,
		totalReviews: 52,
		avgRating: 4.9
	},
	{
		id: 20,
		name: "Cloud Valley Glasshouse Villa",
		address: "31 Hung Vuong, Ward 10",
		price: 125,
		maxGuests: 8,
		latitude: 11.947,
		longitude: 108.468,
		imageUrls: photos.luxuryVilla,
		type: "Villa",
		location: mockLocations[10],
		mod: hosts[3],
		isFavorite: false,
		totalReviews: 33,
		avgRating: 4.8
	},
	{
		id: 21,
		name: "French Vintage Villa near Xuan Huong Lake",
		address: "12 Tran Hung Dao, Ward 10",
		price: 95,
		maxGuests: 5,
		latitude: 11.938,
		longitude: 108.448,
		imageUrls: photos.heritageHouse,
		type: "House",
		location: mockLocations[10],
		mod: hosts[0],
		isFavorite: false,
		totalReviews: 26,
		avgRating: 4.7
	},

	// Nha Trang
	{
		id: 22,
		name: "Ocean Panorama Suite",
		address: "60 Tran Phu, Loc Tho",
		price: 78,
		maxGuests: 4,
		latitude: 12.238,
		longitude: 109.196,
		imageUrls: photos.beachfrontResort,
		type: "Apartment",
		location: mockLocations[11],
		mod: hosts[2],
		isFavorite: false,
		totalReviews: 41,
		avgRating: 4.8
	},
	{
		id: 23,
		name: "Seaside Sunlit Homestay",
		address: "14 Nguyen Thien Thuat, Loc Tho",
		price: 35,
		maxGuests: 2,
		latitude: 12.241,
		longitude: 109.193,
		imageUrls: photos.cozyHomestay,
		type: "Homestay",
		location: mockLocations[11],
		mod: hosts[1],
		isFavorite: false,
		totalReviews: 18,
		avgRating: 4.6
	},

	// Phu Quoc
	{
		id: 24,
		name: "Sunset Beach Private Pool Villa",
		address: "99 Tran Hung Dao, Duong Dong",
		price: 185,
		maxGuests: 6,
		latitude: 10.207,
		longitude: 103.961,
		imageUrls: photos.luxuryVilla,
		type: "Villa",
		location: mockLocations[12],
		mod: hosts[3],
		isFavorite: false,
		totalReviews: 36,
		avgRating: 5.0
	},
	{
		id: 25,
		name: "Tropical Coconut Eco Homestay",
		address: "24 Cua Lap, Duong Dong",
		price: 44,
		maxGuests: 2,
		latitude: 10.183,
		longitude: 103.974,
		imageUrls: photos.beachfrontResort,
		type: "Homestay",
		location: mockLocations[12],
		mod: hosts[0],
		isFavorite: true,
		totalReviews: 29,
		avgRating: 4.8
	}
];

export const mockReviews: Review[] = [
	{
		useId: 12,
		accommodationId: 1,
		comment: "A lovely, clean place in a great location. Waking up to the river breeze was unforgettable.",
		cleanlinessRating: 5,
		locationRating: 5,
		comfortRating: 5,
		amenitiesRating: 4,
		createdDate: "2025-05-14T09:00:00Z",
		user: mockUser
	},
	{
		useId: 15,
		accommodationId: 1,
		comment: "Host was extremely responsive and welcoming. The room is modern, well air-conditioned, and fast Wi-Fi.",
		cleanlinessRating: 5,
		locationRating: 5,
		comfortRating: 4,
		amenitiesRating: 5,
		createdDate: "2025-08-20T14:30:00Z",
		user: {
			id: "mock-user-2",
			name: "Emma Watson",
			email: "emma@example.com",
			phoneNumber: "+1 555 0199",
			avatar: "https://i.pravatar.cc/150?img=32"
		}
	}
];

export const mockAccommodations: AccommodationDetail[] = mockRooms.map(room => ({
	...room,
	description: `Experience a relaxing stay at ${room.name}. Located at ${room.address}, this beautiful ${room.type.toLowerCase()} offers modern amenities, high-speed Wi-Fi, air conditioning, and a serene environment perfect for relaxing or exploring the city.`,
	maxGuests: room.maxGuests ?? 2,
	numberOfBeds: Math.max(1, Math.round((room.maxGuests ?? 2) / 2)),
	numberOfBedrooms: Math.max(1, Math.floor((room.maxGuests ?? 2) / 2)),
	numberOfBathrooms: Math.max(1, Math.ceil((room.maxGuests ?? 2) / 3)),
	checkInAfter: "14:00",
	checkInBefore: "22:00",
	checkOutBefore: "11:00",
	isPetAllowed: room.type === "Villa" || room.type === "House",
	isSmokingAllowed: false,
	isEventAllowed: room.type === "Villa",
	isPhotoAllowed: true,
	quietHoursAfter: "22:00",
	quietHoursBefore: "07:00",
	reviews: mockReviews,
	totalReview: room.totalReviews,
	avgCleanlinessRating: Number((room.avgRating * 0.98).toFixed(1)),
	avgAmenitiesRating: Number((room.avgRating * 0.96).toFixed(1)),
	avgComfortRating: Number((room.avgRating * 0.99).toFixed(1)),
	avgLocationRating: Number(room.avgRating.toFixed(1))
}));

export const mockBookings: BookingDetail[] = [
	{
		id: 101,
		checkInDate: "2026-11-12",
		checkOutDate: "2026-11-15",
		totalPrice: 216,
		isPaid: false,
		createDate: "2026-10-20T09:00:00Z",
		userSummaryDto: {
			id: 1,
			name: mockUser.name,
			email: mockUser.email,
			phoneNumber: mockUser.phoneNumber,
			avatar: mockUser.avatar
		},
		accommodation: {
			...mockRooms[0],
			description: "A comfortable, well-equipped place to enjoy your stay in Da Nang.",
			distance: 1.2,
			checkInAfter: "14:00",
			checkInBefore: "22:00",
			checkOutBefore: "11:00"
		}
	}
];
