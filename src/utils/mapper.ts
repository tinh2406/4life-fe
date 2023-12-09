import { AmenityResponse, LocationResponse } from "../types/axios/paging";
import { SelectType } from './../components/SelectOption/SelectOption';

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
}
