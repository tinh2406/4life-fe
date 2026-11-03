import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { RealtimeClient, SSEEventListener } from "../api/realtime";
import { RealtimeEventPayload, RealtimeEventType, SSEConnectionStatus } from "../types/model/notification";

type AnyObject = Record<string, boolean>;

export interface NotifyContextValue {
	// Trạng thái tương thích ngược
	isModRole: boolean;
	setIsModRole: React.Dispatch<React.SetStateAction<boolean>>;
	isPaid: boolean;
	setIsPaid: React.Dispatch<React.SetStateAction<boolean>>;
	hasNew: boolean;
	setHasNew?: React.Dispatch<React.SetStateAction<boolean>>;
	newNoti: AnyObject;
	clearNoti?: () => void;
	removeNoti?: (id: string) => void;

	// Khả năng mở rộng
	connectionStatus: SSEConnectionStatus;
	subscribeEvent: (eventType: RealtimeEventType | string, listener: SSEEventListener) => () => void;
}

const NotifyContext = createContext<NotifyContextValue>({
	hasNew: false,
	newNoti: {},
	isModRole: false,
	isPaid: false,
	setIsModRole: () => {},
	setIsPaid: () => {},
	connectionStatus: "closed",
	subscribeEvent: () => () => {}
});

export const useNotify = () => {
	return useContext(NotifyContext);
};

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
	const [isModRole, setIsModRole] = useState<boolean>(false);
	const [isPaid, setIsPaid] = useState<boolean>(false);
	const [hasNew, setHasNew] = useState(false);
	const [newNoti, setNewNoti] = useState<AnyObject>({});
	const [connectionStatus, setConnectionStatus] = useState<SSEConnectionStatus>("closed");

	const queryClient = useQueryClient();
	const token = localStorage.getItem("accessToken");
	const clientRef = useRef<RealtimeClient | null>(null);

	useEffect(() => {
		const isMockEnabled = import.meta.env.VITE_ENABLE_MOCKS === "true" || import.meta.env.MODE === "mock";
		if (!token || isMockEnabled) {
			setConnectionStatus("closed");
			return;
		}

		const client = new RealtimeClient({
			token,
			onStatusChange: status => {
				setConnectionStatus(status);
			},
			onError: err => {
				console.warn("[Realtime SSE] Connection error/event:", err);
			}
		});

		clientRef.current = client;

		const registerNotificationItem = (payload: RealtimeEventPayload) => {
			const notiId = (payload?.id || payload?.Id) as string | undefined;
			if (notiId) {
				setNewNoti(last => ({ ...last, [notiId]: true }));
			}
			setHasNew(true);
			queryClient.invalidateQueries("all-notifys");
		};

		// -------------------------------------------------------------
		// 1. CÁC SỰ KIỆN CHO KHÁCH HÀNG (GUEST EVENTS)
		// -------------------------------------------------------------

		// Phê duyệt yêu cầu làm Host/Mod
		const unApproveMod = client.on("GuestReceiveNotifyApproveModMessage", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("user-profile");
			setIsModRole(true);
			toast.success(payload.message || "Yêu cầu trở thành Chủ nhà của bạn đã được phê duyệt!");
		});

		// Khách tạo đơn đặt phòng thành công
		const unBookingSuccess = client.on("GuestReceiveNotifyBookingSuccess", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-bookings");
		});

		// Khách thanh toán đặt phòng thành công
		const unPaymentSuccess = client.on("GuestReceiveNotifyBookingPaymentSuccess", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-bookings");
			queryClient.invalidateQueries("booking-detail");
			setIsPaid(true);
			toast.success(payload.message || "Thanh toán đặt phòng thành công!");
		});

		// Thanh toán đặt phòng thất bại hoặc hết hạn
		const unPaymentFailed = client.on("GuestReceiveNotifyBookingPaymentFailed", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("booking-detail");
			toast.error(payload.message || "Thanh toán không thành công hoặc phiên giao dịch đã hết hạn.");
		});

		// Khách bị hủy đơn hoặc xác nhận hủy thành công
		const unBookingCancelled = client.on("GuestReceiveNotifyBookingCancelled", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-bookings");
			queryClient.invalidateQueries("booking-detail");
			toast.info(payload.message || "Đơn đặt phòng đã được hủy.");
		});

		// Nhắc nhở lịch nhận phòng sắp tới
		const unBookingReminder = client.on("GuestReceiveNotifyBookingReminder", payload => {
			registerNotificationItem(payload);
			toast.info(payload.message || "Bạn có lịch nhận phòng sắp tới. Hãy chuẩn bị hành lý nhé!");
		});

		// -------------------------------------------------------------
		// 2. CÁC SỰ KIỆN CHO CHỦ NHÀ (HOST EVENTS)
		// -------------------------------------------------------------

		// Có khách đặt phòng mới
		const unHostNewBooking = client.on("HostReceiveNewBooking", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("booking-of-my-accommodations");
			toast.info(payload.message || "Bạn vừa có một đơn đặt phòng mới!");
		});

		// Khách thanh toán cho đơn của host
		const unHostBookingPaid = client.on("HostReceiveBookingPaymentSuccess", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("booking-of-my-accommodations");
			toast.success(payload.message || "Khách hàng đã thanh toán cho đơn đặt phòng!");
		});

		// Khách hủy đơn đặt phòng của host
		const unHostBookingCancelled = client.on("HostReceiveBookingCancelled", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("booking-of-my-accommodations");
			toast.warn(payload.message || "Khách đã hủy một đơn đặt phòng.");
		});

		// Bài đăng phòng được phê duyệt
		const unAccommodationApproved = client.on("HostReceiveAccommodationApproved", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-accommodations");
			toast.success(payload.message || "Chỗ ở của bạn đã được duyệt và bắt đầu hiển thị công khai!");
		});

		// Bài đăng phòng bị từ chối duyệt
		const unAccommodationRejected = client.on("HostReceiveAccommodationRejected", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-accommodations");
			toast.error(payload.message || "Bài đăng chỗ ở của bạn chưa được duyệt.");
		});

		// Có đánh giá mới cho chỗ ở của Host
		const unNewReview = client.on("HostReceiveNewReview", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("reviews");
			queryClient.invalidateQueries("accommodation-detail");
			toast.info(payload.message || "Chỗ ở của bạn vừa nhận được đánh giá mới!");
		});

		// -------------------------------------------------------------
		// 3. SỰ KIỆN CHUNG & HỆ THỐNG (SYSTEM / SHARED EVENTS)
		// -------------------------------------------------------------

		// Thông báo tổng quát
		const unNewNotification = client.on("NewNotificationReceived", payload => {
			registerNotificationItem(payload);
		});

		// Trạng thái đặt phòng thay đổi nói chung
		const unBookingStatusChanged = client.on("BookingStatusChanged", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-bookings");
			queryClient.invalidateQueries("booking-detail");
			queryClient.invalidateQueries("booking-of-my-accommodations");
		});

		// Trạng thái bài đăng chỗ ở thay đổi nói chung
		const unAccommodationStatusChanged = client.on("AccommodationStatusChanged", payload => {
			registerNotificationItem(payload);
			queryClient.invalidateQueries("my-accommodations");
			queryClient.invalidateQueries("accommodations");
		});

		// Khởi động kết nối
		client.connect();

		return () => {
			unApproveMod();
			unBookingSuccess();
			unPaymentSuccess();
			unPaymentFailed();
			unBookingCancelled();
			unBookingReminder();
			unHostNewBooking();
			unHostBookingPaid();
			unHostBookingCancelled();
			unAccommodationApproved();
			unAccommodationRejected();
			unNewReview();
			unNewNotification();
			unBookingStatusChanged();
			unAccommodationStatusChanged();
			client.disconnect();
			clientRef.current = null;
		};
	}, [token, queryClient]);

	const clearNoti = () => setNewNoti({});
	const removeNoti = (id: string) => {
		setNewNoti(last => {
			const updated = { ...last };
			delete updated[id];
			return updated;
		});
	};

	const subscribeEvent = (eventType: RealtimeEventType | string, listener: SSEEventListener): (() => void) => {
		if (clientRef.current) {
			return clientRef.current.on(eventType, listener);
		}
		return () => {};
	};

	const value: NotifyContextValue = {
		isModRole,
		setIsModRole,
		isPaid,
		setIsPaid,
		hasNew,
		setHasNew,
		newNoti,
		clearNoti,
		removeNoti,
		connectionStatus,
		subscribeEvent
	};

	return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>;
};
