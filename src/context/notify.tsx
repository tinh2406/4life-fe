import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type NotifyContextValue = {
	isModRole: boolean; // Thêm trạng thái isModRole
	setIsModRole: React.Dispatch<React.SetStateAction<boolean>>;
	isPaid: boolean;
	setIsPaid: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotifyContext = createContext<NotifyContextValue | null>(null);

let connection: HubConnection;

export const useNotify = () => {
	return useContext(NotifyContext);
};

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
	const [isModRole, setIsModRole] = useState<boolean>(false);
	const [isPaid, setIsPaid] = useState<boolean>(false);
	// const queryClient = useQueryClient();
	const token = localStorage.getItem("accessToken");
	useEffect(() => {
		if (!token) return;
		connection = new HubConnectionBuilder()
			.withUrl("https://tuna.whitemage.tech/NotificationHub", {
				accessTokenFactory: () => token,
				skipNegotiation: true,
				transport: HttpTransportType.WebSockets
			})
			.build();

		connection.on("GuestReceiveNotifyApproveModMessage", async function (_message) {
			console.log("message", _message);
			setIsModRole(true);
		});

		connection.on("GuestReceiveNotifyBookingPaymentSuccess", async function (_message) {
			console.log("message", _message);
			setIsPaid(true);
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

	const value = {
		isModRole,
		setIsModRole,
		isPaid,
		setIsPaid
	};
	return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>;
};
