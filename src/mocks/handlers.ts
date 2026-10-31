import { http, HttpResponse } from "msw";
import { mockAccommodations, mockAmenities, mockBookings, mockLocations, mockReviews, mockRooms, mockUser } from "./data";

const API = "https://tuna.whitemage.tech/api";
let favoriteIds = new Set(mockRooms.filter(room => room.isFavorite).map(room => room.id));
let bookings = [...mockBookings];
let accommodations = [...mockAccommodations];
let user = { ...mockUser };
let nextId = 200;

const page = <T,>(items: T[], request: Request) => {
	const url = new URL(request.url);
	const pageIndex = Math.max(1, Number(url.searchParams.get("PageIndex") ?? url.searchParams.get("pageIndex") ?? 1));
	const pageSize = Math.max(1, Number(url.searchParams.get("PageSize") ?? url.searchParams.get("pageSize") ?? 20));
	const keyword = (url.searchParams.get("Keyword") ?? url.searchParams.get("keyword") ?? "").toLowerCase();
	const filtered = keyword ? items.filter(item => JSON.stringify(item).toLowerCase().includes(keyword)) : items;
	return { meta: { pageIndex, pageSize, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)), totalCount: filtered.length }, data: filtered.slice((pageIndex - 1) * pageSize, pageIndex * pageSize) };
};
const ok = (message = "Success") => HttpResponse.json({ isSuccess: true, message });

export const handlers = [
	http.post(`${API}/auths/login`, async ({ request }) => {
		const body = await request.json() as { email?: string; password?: string };
		if (!body.email || !body.password) return HttpResponse.json({ message: "Invalid credentials" }, { status: 400 });
		return HttpResponse.json({ token: "mock-access-token", userResult: user });
	}),
	http.post(`${API}/auths/google-login`, () => HttpResponse.json({ token: "mock-access-token", userResult: user })),
	http.post(`${API}/auths/register`, async ({ request }) => {
		const body = await request.json() as { email?: string; name?: string };
		return HttpResponse.json({ id: nextId++, name: body.name ?? "New guest", email: body.email ?? "guest@4life.test" }, { status: 200 });
	}),
	http.get(`${API}/users/profile`, () => HttpResponse.json(user)),
	http.put(`${API}/users/update-profile`, async ({ request }) => {
		user = { ...user, ...await request.json() as Partial<typeof user> };
		return HttpResponse.json(user);
	}),
	http.put(`${API}/users/change-password`, () => ok("Password updated")),
	http.post(`${API}/auths/forgot-password`, () => ok("A mock verification code was sent")),
	http.post(`${API}/auths/verify-otp-forgot-password`, () => ok("Code verified")),
	http.post(`${API}/auths/reset-password`, () => ok("Password reset")),
	http.post(`${API}/users/verify-email`, () => ok("A mock verification code was sent")),
	http.post(`${API}/users/verify-otp-confirm-email`, () => ok("Email verified")),
	http.put(`${API}/users/register-mod`, () => ok("Request submitted")),
	http.post(`${API}/upload-images/images`, () => HttpResponse.json({ url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200", urls: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200"] })),
	http.get(`${API}/locations`, ({ request }) => HttpResponse.json(page(mockLocations, request))),
	http.get(`${API}/amenities`, ({ request }) => HttpResponse.json(page(mockAmenities, request))),
	http.get(`${API}/accommodations`, ({ request }) => {
		const url = new URL(request.url);
		const locationId = Number(url.searchParams.get("locationId"));
		const maxGuests = Number(url.searchParams.get("MaxGuests"));
		const type = url.searchParams.get("type");
		const keyword = (url.searchParams.get("Keyword") ?? url.searchParams.get("keyword") ?? "").toLowerCase();
		let rooms = mockRooms
			.filter(room => !locationId || room.location.id === locationId)
			.filter(room => !maxGuests || (room.maxGuests ?? 0) >= maxGuests)
			.filter(room => {
				if (!type) return true;
				if (type.toLowerCase() === "other") {
					return !["homestay", "villa"].includes(room.type.toLowerCase());
				}
				return room.type.toLowerCase() === type.toLowerCase();
			})
			.filter(room => {
				if (!keyword) return true;
				return (
					room.name.toLowerCase().includes(keyword) ||
					room.address.toLowerCase().includes(keyword) ||
					room.location.city.toLowerCase().includes(keyword) ||
					room.location.district.toLowerCase().includes(keyword)
				);
			})
			.map(room => ({ ...room, isFavorite: favoriteIds.has(room.id) }));

		const sortBy = url.searchParams.get("SortBy") ?? url.searchParams.get("sortBy");
		const isDescending = (url.searchParams.get("IsDescending") ?? url.searchParams.get("isDescending")) === "true";
		if (sortBy === "Price") {
			rooms = [...rooms].sort((a, b) => isDescending ? b.price - a.price : a.price - b.price);
		} else if (sortBy === "Name") {
			rooms = [...rooms].sort((a, b) => isDescending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
		}

		return HttpResponse.json(page(rooms, request));
	}),
	http.get(`${API}/accommodations/self`, ({ request }) => HttpResponse.json(page(accommodations, request))),
	http.get(`${API}/favorites`, ({ request }) => HttpResponse.json(page(mockRooms.filter(room => favoriteIds.has(room.id)), request))),
	http.post(`${API}/favorites`, async ({ request }) => {
		const body = await request.json() as { accommodationId?: number; isFavorite?: boolean };
		if (body.accommodationId) body.isFavorite ? favoriteIds.add(body.accommodationId) : favoriteIds.delete(body.accommodationId);
		return ok("Favorite updated");
	}),
	http.get(`${API}/accommodations/:id`, ({ params }) => {
		const accommodation = accommodations.find(item => item.id === Number(params.id));
		return accommodation ? HttpResponse.json({ ...accommodation, isFavorite: favoriteIds.has(accommodation.id) }) : HttpResponse.json({ message: "Not found" }, { status: 404 });
	}),
	http.post(`${API}/accommodations`, async ({ request }) => {
		const body = await request.json() as Record<string, unknown>;
		const room = { ...mockAccommodations[0], ...body, id: nextId++, imageUrls: (body.imageUrls as string[]) ?? mockAccommodations[0].imageUrls } as typeof mockAccommodations[number];
		accommodations = [...accommodations, room];
		return HttpResponse.json(room, { status: 201 });
	}),
	http.put(`${API}/accommodations/:id`, async ({ params, request }) => {
		const id = Number(params.id);
		const changes = await request.json() as Partial<(typeof accommodations)[number]>;
		accommodations = accommodations.map(item => item.id === id ? { ...item, ...changes } : item);
		return HttpResponse.json(accommodations.find(item => item.id === id) ?? {});
	}),
	http.delete(`${API}/accommodations/:id`, ({ params }) => {
		accommodations = accommodations.filter(item => item.id !== Number(params.id));
		return ok("Accommodation deleted");
	}),
	http.get(`${API}/accommodation/amenities/:id`, ({ params, request }) => HttpResponse.json(page(mockAmenities.map(amenity => ({ accommodationId: Number(params.id), amenity })), request))),
	http.put(`${API}/accommodation/amenities`, () => ok("Amenities updated")),
	http.get(`${API}/reviews/:id`, ({ request }) => HttpResponse.json(page(mockReviews, request))),
	http.post(`${API}/reviews`, async ({ request }) => {
		const body = await request.json() as Partial<(typeof mockReviews)[number]>;
		return HttpResponse.json({ ...mockReviews[0], ...body, useId: 13, createdDate: new Date().toISOString(), user });
	}),
	http.get(`${API}/reviews/check-review/:id`, () => HttpResponse.json({ isSuccess: true, message: "You can review this stay" })),
	http.post(`${API}/bookings`, async ({ request }) => {
		const body = await request.json() as { accommodationId?: number; checkInDate?: string; checkOutDate?: string };
		const stay = accommodations.find(item => item.id === body.accommodationId) ?? mockAccommodations[0];
		const booking = { ...mockBookings[0], id: nextId++, checkInDate: body.checkInDate ?? "2026-11-12", checkOutDate: body.checkOutDate ?? "2026-11-15", totalPrice: stay.price * 3, isPaid: false, accommodation: { ...mockBookings[0].accommodation, ...stay } };
		bookings = [...bookings, booking];
		return HttpResponse.json(booking, { status: 201 });
	}),
	http.get(`${API}/bookings/self-user`, () => HttpResponse.json(bookings)),
	http.get(`${API}/bookings/self-mod`, ({ request }) => HttpResponse.json(page([], request))),
	http.get(`${API}/bookings/:id`, ({ params }) => {
		const booking = bookings.find(item => item.id === Number(params.id));
		return booking ? HttpResponse.json(booking) : HttpResponse.json({ message: "Not found" }, { status: 404 });
	}),
	http.post(`${API}/payment`, () => HttpResponse.text("https://example.com/mock-payment")),
	http.get(`${API}/statistics/total-amount`, () => HttpResponse.json({ totalAmount: 864, totalBookings: bookings.length })),
	http.get(`${API}/statistics/total-sales-life-growth`, ({ request }) => {
		const url = new URL(request.url);
		const count = Math.max(1, Number(url.searchParams.get("NumberCycles") ?? 6));
		return HttpResponse.json({ typeCycles: url.searchParams.get("TypeCycles") ?? "Month", numberCycles: count, valueCycles: Array.from({ length: count }, (_, index) => ({ dateFrom: `2026-${String(index + 1).padStart(2, "0")}-01`, dateTo: `2026-${String(index + 1).padStart(2, "0")}-28`, cyclesNo: index + 1, value: 300 + index * 80 })) });
	}),
	http.get(`${API}/notifications`, ({ request }) => HttpResponse.json(page([{ id: "n1", content: "Welcome to 4LIFE!", note: "", createdDate: "2026-10-20T09:00:00Z", avatar: user.avatar }], request)))
];

export const resetMockState = () => {
	favoriteIds = new Set(mockRooms.filter(room => room.isFavorite).map(room => room.id));
	bookings = [...mockBookings];
	accommodations = [...mockAccommodations];
	user = { ...mockUser };
	nextId = 200;
};
