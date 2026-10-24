import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

// type AnyObject = {
// 	[key: string]: boolean;
// } & object;
type AnyObject = Record<string, boolean>;

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

let connection: HubConnection;

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
		if (!token || import.meta.env.VITE_ENABLE_MOCKS === "true") return;
		connection = new HubConnectionBuilder()
			.withUrl("https://tuna.whitemage.tech/NotificationHub", {
				accessTokenFactory: () => token,
				skipNegotiation: true,
				transport: HttpTransportType.WebSockets
			})
			.build();

		connection.on("GuestReceiveNotifyApproveModMessage", async function (_message) {
			console.log("GuestReceiveNotifyApproveModMessage", _message);
			// const data: { Id: string; [key: string]: any } = JSON.parse(_message);
			// setNewNoti(last => ({ ...last, [data.Id]: true }));
			queryClient.invalidateQueries("all-notifys");
			setIsModRole(true);
			setHasNew(true);
		});

		connection.on("GuestReceiveNotifyBookingPaymentSuccess", async function (_message) {
			const data: { Id: string; [key: string]: any } = JSON.parse(_message);
			setNewNoti(last => ({ ...last, [data.Id]: true }));
			console.log("GuestReceiveNotifyBookingPaymentSuccess", newNoti);
			queryClient.invalidateQueries("all-notifys");
			setIsPaid(true);
			setHasNew(true);
		});

		connection.on("GuestReceiveNotifyBookingSuccess", async function (_message) {
			console.log("GuestReceiveNotifyBookingSuccess", _message);
			const data: { Id: string; [key: string]: any } = JSON.parse(_message);
			setNewNoti(last => ({ ...last, [data.Id]: true }));
			queryClient.invalidateQueries("all-notifys");
			// setIsPaid(true);
			setHasNew(true);
		});

		connection.start().then(function () {
			console.log("Connected!");
		});
		return () => {
			if (connection) {
				connection.stop();
			}
		};
	}, [token]);

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
