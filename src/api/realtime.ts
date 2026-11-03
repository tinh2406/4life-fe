import { RealtimeEventPayload, RealtimeEventType, SSEConnectionStatus } from "../types/model/notification";

export type SSEEventListener = (payload: RealtimeEventPayload) => void;

export interface RealtimeClientOptions {
	url?: string;
	token: string;
	onStatusChange?: (status: SSEConnectionStatus) => void;
	onError?: (error: Event) => void;
}

export const ALL_REALTIME_EVENTS: RealtimeEventType[] = [
	// Guest
	"GuestReceiveNotifyApproveModMessage",
	"GuestReceiveNotifyBookingSuccess",
	"GuestReceiveNotifyBookingPaymentSuccess",
	"GuestReceiveNotifyBookingPaymentFailed",
	"GuestReceiveNotifyBookingCancelled",
	"GuestReceiveNotifyBookingReminder",
	// Host
	"HostReceiveNewBooking",
	"HostReceiveBookingPaymentSuccess",
	"HostReceiveBookingCancelled",
	"HostReceiveAccommodationApproved",
	"HostReceiveAccommodationRejected",
	"HostReceiveNewReview",
	// System / Shared
	"NewNotificationReceived",
	"BookingStatusChanged",
	"AccommodationStatusChanged"
];

export class RealtimeClient {
	private eventSource: EventSource | null = null;
	private listeners: Map<string, Set<SSEEventListener>> = new Map();
	private options: RealtimeClientOptions;

	constructor(options: RealtimeClientOptions) {
		this.options = options;
	}

	public connect(): void {
		if (this.eventSource) {
			this.disconnect();
		}

		const baseUrl =
			this.options.url ||
			import.meta.env.VITE_NOTIFY_SSE_URL ||
			"https://tuna.whitemage.tech/api/notifications/stream";

		const sseUrl = `${baseUrl}?token=${encodeURIComponent(this.options.token)}`;

		try {
			this.options.onStatusChange?.("connecting");
			const es = new EventSource(sseUrl);
			this.eventSource = es;

			es.onopen = () => {
				this.options.onStatusChange?.("open");
			};

			es.onerror = (err: Event) => {
				this.options.onStatusChange?.("error");
				this.options.onError?.(err);
			};

			// 1. Generic message listener: data chứa JSON có { type / event, data / payload }
			es.onmessage = (event: MessageEvent) => {
				this.handleRawMessage(event.data);
			};

			// 2. Named events listener cho toàn bộ event đã định nghĩa
			ALL_REALTIME_EVENTS.forEach(eventType => {
				es.addEventListener(eventType, (event: MessageEvent) => {
					this.handleNamedEvent(eventType, event.data);
				});
			});
		} catch (error) {
			this.options.onStatusChange?.("error");
		}
	}

	public on(eventType: RealtimeEventType | string, listener: SSEEventListener): () => void {
		if (!this.listeners.has(eventType)) {
			this.listeners.set(eventType, new Set());
		}
		this.listeners.get(eventType)?.add(listener);

		// Nếu kết nối đang mở và là custom event mới chưa đăng ký với eventSource, đăng ký thêm
		if (this.eventSource && !["onmessage", "open", "error"].includes(eventType)) {
			this.eventSource.addEventListener(eventType, (event: MessageEvent) => {
				this.handleNamedEvent(eventType, event.data);
			});
		}

		return () => {
			this.listeners.get(eventType)?.delete(listener);
		};
	}

	private handleNamedEvent(eventType: string, rawData: string): void {
		let parsedData: unknown = rawData;
		try {
			parsedData = JSON.parse(rawData);
		} catch {
			// Giữ nguyên chuỗi nếu không phải JSON
		}

		const payload: RealtimeEventPayload =
			typeof parsedData === "object" && parsedData !== null
				? (parsedData as RealtimeEventPayload)
				: { type: eventType, message: String(rawData) };

		this.dispatch(eventType, payload);
	}

	private handleRawMessage(rawData: string): void {
		try {
			const parsed = JSON.parse(rawData);
			const eventType: string = parsed?.type || parsed?.event || "NewNotificationReceived";
			const payload: RealtimeEventPayload = parsed?.data ?? parsed;
			this.dispatch(eventType, payload);
		} catch {
			this.dispatch("NewNotificationReceived", { message: rawData });
		}
	}

	private dispatch(eventType: string, payload: RealtimeEventPayload): void {
		const eventListeners = this.listeners.get(eventType);
		if (eventListeners) {
			eventListeners.forEach(listener => {
				try {
					listener(payload);
				} catch (err) {
					console.error(`Error in realtime listener for ${eventType}:`, err);
				}
			});
		}
	}

	public disconnect(): void {
		if (this.eventSource) {
			this.eventSource.close();
			this.eventSource = null;
			this.options.onStatusChange?.("closed");
		}
	}
}
