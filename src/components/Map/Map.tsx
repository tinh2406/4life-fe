import {
	GoogleMap,
	LoadScript,
	StandaloneSearchBox,
	Marker
	// Autocomplete
	// useLoadScript
} from "@react-google-maps/api";
import { useState } from "react";

type SelectedPlaceType = {
	geometry: {
		location: {
			lat: number | undefined;
			lng: number | undefined;
		};
	};
	name: string;
};

interface MapProps {
	selectedPlace: SelectedPlaceType | null;
	setSelectedPlace: (selectedPlace: SelectedPlaceType) => void;
}

const MapContainer = ({ selectedPlace, setSelectedPlace }: MapProps): React.JSX.Element => {
	// const [searchResult, setSearchResult] = useState("Result");
	// const { isLoaded } = useLoadScript({
	// 	googleMapsApiKey: "AIzaSyAHUq7rXW6gtVCss6HHxDGK9Su14uwkdU0",
	// 	libraries: ["places"]
	// });
	// const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
	// 	setSearchResult(autocomplete);
	// };
	// const onPlaceChanged = () => {
	// 	if (searchResult !== null) {
	// 		const place = searchResult.getPlace();
	// 		const name = place.name;
	// 		const status = place.business_status;
	// 		const formattedAddress = place.formatted_address;
	// 		console.log(`Name: ${name}`);
	// 		console.log(`Business Status: ${status}`);
	// 		console.log(`Formatted Address: ${formattedAddress}`);
	// 	} else {
	// 		alert("Please enter text");
	// 	}
	// };
	// if (!isLoaded) {
	// 	return <div>Loading...</div>;
	// }
	// return (
	// 	<div className="App">
	// 		<div id="searchColumn">
	// 			<h2>Tide Forecast Options</h2>
	// 			<Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
	// 				<input
	// 					type="text"
	// 					placeholder="Search for Tide Information"
	// 					style={{
	// 						boxSizing: `border-box`,
	// 						border: `1px solid transparent`,
	// 						width: `240px`,
	// 						height: `32px`,
	// 						padding: `0 12px`,
	// 						borderRadius: `3px`,
	// 						boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
	// 						fontSize: `14px`,
	// 						outline: `none`,
	// 						textOverflow: `ellipsis`
	// 					}}
	// 				/>
	// 			</Autocomplete>
	// 		</div>
	// 	</div>
	// );

	const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
	const [mapCenter, setMapCenter] = useState({ lat: 16.07, lng: 108.15 });

	const onLoad = (ref: google.maps.places.SearchBox) => {
		setSearchBox(ref);
	};

	const onPlaceChanged = () => {
		if (searchBox !== null) {
			const places = searchBox.getPlaces();
			if (places && places?.length !== 0) {
				const selectedPlace = {
					geometry: {
						location: {
							lat: places[0]?.geometry?.location?.lat(),
							lng: places[0]?.geometry?.location?.lng()
						}
					},
					name: places[0]?.name || ""
				};

				setMapCenter({
					lat: selectedPlace.geometry.location.lat || 16.07,
					lng: selectedPlace.geometry.location.lng || 108.15
				});

				setSelectedPlace(selectedPlace);
			}
		}
	};
	return (
		<LoadScript googleMapsApiKey="AIzaSyAHUq7rXW6gtVCss6HHxDGK9Su14uwkdU0" libraries={["places"]}>
			<GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={mapCenter} zoom={14}>
				<StandaloneSearchBox onPlacesChanged={onPlaceChanged} onLoad={onLoad}>
					<input
						type="text"
						placeholder="customized your placeholder"
						style={{
							border: `1px solid transparent`,
							width: `240px`,
							height: `40px`,
							padding: `0 12px`,
							borderRadius: `8px`,
							textOverflow: `ellipses`,
							position: "absolute",
							left: "50%",
							marginLeft: "-120px",
							marginTop: "10px",
							boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
							outline: `none`
						}}
					/>
				</StandaloneSearchBox>
				{selectedPlace && selectedPlace.geometry.location.lat && selectedPlace.geometry.location.lng && (
					<Marker
						position={{
							lat: selectedPlace.geometry.location.lat,
							lng: selectedPlace.geometry.location.lng
						}}
						title={selectedPlace.name}
					/>
				)}
			</GoogleMap>
		</LoadScript>
	);
};

export default MapContainer;
