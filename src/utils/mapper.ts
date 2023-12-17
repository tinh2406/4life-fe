import { AmenityResponse, LocationResponse } from "../types/axios/paging";
import { SelectType } from "./../components/SelectOption/SelectOption";

export const transformLocationOptions = (locationsResponse: LocationResponse[]): SelectType[] => {
	return locationsResponse.map(location => {
		return {
			label: location.city + ", " + location.district,
			value: location.id
		};
	});
};

export const transformAmenityOptions = (amenitiesResponse: AmenityResponse[]): SelectType[] => {
	return amenitiesResponse.map(amenity => {
		return {
			label: amenity.name,
			value: amenity.id
		};
	});
};

export const convertFormatTime = (time: string): string => {
	return `${time}:00`;
};

export const convertTo12HourFormat = (time: string | undefined) => {
	console.log(time);
	// Tách giờ và phút từ chuỗi thời gian
	if (time) {
		const [hours, minutes] = time.split(":");
		// Chuyển đổi sang số nguyên
		const parsedHours = parseInt(hours, 10);
		const parsedMinutes = parseInt(minutes, 10);

		// Xác định nếu là AM hoặc PM và chuyển đổi giờ
		const amOrPm = parsedHours >= 12 ? "PM" : "AM";
		const twelveHourFormatHours = parsedHours % 12 || 12;

		// Định dạng lại chuỗi thời gian
		const formattedTime = `${twelveHourFormatHours}:${parsedMinutes < 10 ? "0" : ""}${parsedMinutes} ${amOrPm}`;

		return formattedTime;
	} else {
		return "";
	}
};
