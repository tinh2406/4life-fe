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
			lat: number;
			lng: number;
		};
	};
	name: string;
};

interface MapProps {
	selectedPlace: SelectedPlaceType | null;
	setSelectedPlace: (selectedPlace: SelectedPlaceType) => void;
}

const MapContainer = ({ selectedPlace, setSelectedPlace }: MapProps): React.JSX.Element => {
	console.log("selectedPlace ne", selectedPlace);
	const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
	const [mapCenter, setMapCenter] = useState({ lat: 16.07, lng: 108.15 });
	// const [markerPosition, setMarkerPosition] = useState({ lat: 16.07, lng: 108.15 });
	// console.log("markerPosition", markerPosition);

	// useEffect(() => {
	// 	setMarkerPosition({
	// 		lat: selectedPlace?.geometry.location.lat || 16.07,
	// 		lng: selectedPlace?.geometry.location.lng || 108.15
	// 	});
	// });

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
							lat: places[0]?.geometry?.location?.lat() || 16.07,
							lng: places[0]?.geometry?.location?.lng() || 108.15
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
					<>
						<Marker
							position={{
								lat: selectedPlace.geometry.location.lat,
								lng: selectedPlace.geometry.location.lng
								// lat: markerPosition.lat,
								// lng: markerPosition.lng
							}}
							title={selectedPlace.name}
						/>
						{/* <h1>Map</h1> */}
					</>
				)}
			</GoogleMap>
		</LoadScript>
	);
};

export default MapContainer;
