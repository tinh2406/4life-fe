import { useEffect, useRef } from "react";
import { useNotify } from "../context/notify";
import { RealtimeEventPayload, RealtimeEventType } from "../types/model/notification";

export const useRealtimeEvent = (
	eventType: RealtimeEventType | string,
	callback: (payload: RealtimeEventPayload) => void
): void => {
	const { subscribeEvent } = useNotify();
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const unsubscribe = subscribeEvent(eventType, payload => {
			callbackRef.current(payload);
		});
		return unsubscribe;
	}, [eventType, subscribeEvent]);
};

export default useRealtimeEvent;

