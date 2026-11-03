import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

// type AnyObject = {
// 	[key: string]: boolean;
// } & object;
type AnyObject = Record<string, boolean>;

type NotificationPayload = {
	Id?: string;
	[key: string]: unknown;
};

type NotifyContextValue = {
	isModRole: boolean; // Thêm trạng thái isModRole
	setIsModRole: React.Dispatch<React.SetStateAction<boolean>>;
	isPaid: boolean;
	setIsPaid: React.Dispatch<React.SetStateAction<boolean>>;
	hasNew: boolean;
	setHasNew?: React.Dispatch<React.SetStateAction<boolean>>;
	newNoti: AnyObject;
	clearNoti?: () => void;
	removeNoti?: (id: string) => void;
};

const NotifyContext = createContext<NotifyContextValue>({
	hasNew: false,
	newNoti: {},
	isModRole: false,
	isPaid: false,
	setIsModRole: () => {},
	setIsPaid: () => {}
});

let eventSource: EventSource | null = null;

export const useNotify = () => {
	return useContext(NotifyContext);
};

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
	const [isModRole, setIsModRole] = useState<boolean>(false);
	const [isPaid, setIsPaid] = useState<boolean>(false);
	const [hasNew, setHasNew] = useState(false);
	const [newNoti, setNewNoti] = useState<AnyObject>({});

	const queryClient = useQueryClient();
	const token = localStorage.getItem("accessToken");
	useEffect(() => {
		const isMockEnabled = import.meta.env.VITE_ENABLE_MOCKS === "true" || import.meta.env.MODE === "mock";
		if (!token || isMockEnabled) return;

		// Endpoint SSE cho thông báo từ biến môi trường (fallback về endpoint mặc định)
		const sseBaseUrl = import.meta.env.VITE_NOTIFY_SSE_URL || "http://localhost:3000/sse";
		const sseUrl = `${sseBaseUrl}?token=${encodeURIComponent(token)}`;
		const es = new EventSource(sseUrl);
		eventSource = es;

		const handleApproveMod = (_data?: unknown) => {
			console.log("GuestReceiveNotifyApproveModMessage", _data);
			queryClient.invalidateQueries("all-notifys");
			setIsModRole(true);
			setHasNew(true);
		};

		const handlePaymentSuccess = (rawMessage?: string) => {
			try {
				if (rawMessage) {
					const data = JSON.parse(rawMessage) as NotificationPayload;
					if (data?.Id) {
						setNewNoti(last => ({ ...last, [data.Id as string]: true }));
					}
				}
			} catch (e) {
				console.error("Error parsing payment success message:", e);
			}
			queryClient.invalidateQueries("all-notifys");
			setIsPaid(true);
			setHasNew(true);
		};

		const handleBookingSuccess = (rawMessage?: string) => {
			console.log("GuestReceiveNotifyBookingSuccess", rawMessage);
			try {
				if (rawMessage) {
					const data = JSON.parse(rawMessage) as NotificationPayload;
					if (data?.Id) {
						setNewNoti(last => ({ ...last, [data.Id as string]: true }));
					}
				}
			} catch (e) {
				console.error("Error parsing booking success message:", e);
			}
			queryClient.invalidateQueries("all-notifys");
			setHasNew(true);
		};

		// 1. Lắng nghe Custom SSE Events (VD: Backend gửi `event: GuestReceiveNotifyBookingSuccess\ndata: ...\n\n`)
		es.addEventListener("GuestReceiveNotifyApproveModMessage", (event: MessageEvent) => {
			handleApproveMod(event.data);
		});

		es.addEventListener("GuestReceiveNotifyBookingPaymentSuccess", (event: MessageEvent) => {
			handlePaymentSuccess(event.data);
		});

		es.addEventListener("GuestReceiveNotifyBookingSuccess", (event: MessageEvent) => {
			handleBookingSuccess(event.data);
		});

		// 2. Lắng nghe Generic Message Event (VD: Backend gửi qua event message mặc định kèm payload JSON)
		es.onmessage = (event: MessageEvent) => {
			try {
				const parsed = JSON.parse(event.data);
				const eventType = parsed?.type || parsed?.event;
				const messageData =
					typeof parsed?.data === "string" ? parsed.data : JSON.stringify(parsed?.data || parsed);

				if (eventType === "GuestReceiveNotifyApproveModMessage") {
					handleApproveMod(messageData);
				} else if (eventType === "GuestReceiveNotifyBookingPaymentSuccess") {
					handlePaymentSuccess(messageData);
				} else if (eventType === "GuestReceiveNotifyBookingSuccess") {
					handleBookingSuccess(messageData);
				}
			} catch {
				// message không phải JSON hợp lệ thì bỏ qua
			}
		};

		es.onopen = () => {
			console.log("SSE Connected to Notification stream!");
		};

		es.onerror = err => {
			console.error("SSE connection error:", err);
		};

		return () => {
			if (es) {
				es.close();
				if (eventSource === es) {
					eventSource = null;
				}
			}
		};
	}, [token, queryClient]);

	const clearNoti = () => setNewNoti({});
	const removeNoti = (id: string) => {
		delete newNoti[id];
	};

	const value = {
		isModRole,
		setIsModRole,
		isPaid,
		setIsPaid,
		hasNew,
		setHasNew,
		newNoti,
		clearNoti,
		removeNoti
	};
	return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>;
};
