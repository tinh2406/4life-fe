export type RealtimeEventType =
	// --- Luồng sự kiện của Khách hàng (Guest) ---
	| "GuestReceiveNotifyApproveModMessage"
	| "GuestReceiveNotifyBookingSuccess"
	| "GuestReceiveNotifyBookingPaymentSuccess"
	| "GuestReceiveNotifyBookingPaymentFailed"
	| "GuestReceiveNotifyBookingCancelled"
	| "GuestReceiveNotifyBookingReminder"

	// --- Luồng sự kiện của Chủ nhà (Host) ---
	| "HostReceiveNewBooking"
	| "HostReceiveBookingPaymentSuccess"
	| "HostReceiveBookingCancelled"
	| "HostReceiveAccommodationApproved"
	| "HostReceiveAccommodationRejected"
	| "HostReceiveNewReview"

	// --- Luồng sự kiện Hệ thống / Chung (System / Shared) ---
	| "NewNotificationReceived"
	| "BookingStatusChanged"
	| "AccommodationStatusChanged";

export interface RealtimeEventPayload<T = unknown> {
	id?: string;
	Id?: string;
	type?: RealtimeEventType | string;
	title?: string;
	message?: string;
	content?: string;
	data?: T;
	createdAt?: string;
	[key: string]: unknown;
}

export interface BookingEventData {
	bookingId?: number | string;
	accommodationId?: number;
	accommodationName?: string;
	guestName?: string;
	amount?: number;
	status?: "Pending" | "Paid" | "Cancelled" | "Completed" | string;
	checkInDate?: string;
	checkOutDate?: string;
	[key: string]: unknown;
}

export interface AccommodationEventData {
	accommodationId?: number;
	accommodationName?: string;
	status?: "Pending" | "Active" | "Rejected";
	reason?: string;
	[key: string]: unknown;
}

export interface ReviewEventData {
	reviewId?: number | string;
	accommodationId?: number;
	guestName?: string;
	rating?: number;
	comment?: string;
	[key: string]: unknown;
}

export type SSEConnectionStatus = "connecting" | "open" | "closed" | "error";
