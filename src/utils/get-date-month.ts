import { Dayjs } from "dayjs";
import { format, parseISO } from "date-fns";

export const calculateDaysDifference = (checkin: Dayjs | null, checkout: Dayjs | null): number => {
	if (checkin && checkout) {
		const daysDifference = checkout.diff(checkin, "day");
		return daysDifference;
	}
	return 0;
};

export const formatDate = (dateString: string): string => {
	const parsedDate = parseISO(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
	const formattedDate = format(parsedDate, "eeee, dd MMMM yyyy"); // Định dạng ngày theo "Friday, 23 November 2023"
	return formattedDate;
};
