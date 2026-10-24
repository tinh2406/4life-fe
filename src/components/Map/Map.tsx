import {
	GoogleMap,
	LoadScript,
	StandaloneSearchBox,
	Marker
} from "@react-google-maps/api";
import { useState } from "react";

const mapApiKey = import.meta.env.GOOGLE_MAPS_API_KEY;

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
	return mapApiKey ? (
		<LoadScript googleMapsApiKey={mapApiKey} libraries={["places"]}>
			<GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={mapCenter} zoom={14}>
				<StandaloneSearchBox onPlacesChanged={onPlaceChanged} onLoad={onLoad}>
					<input
						type="text"
						aria-label="Search for a location"
						placeholder="Search for an address or place"
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
							}}
							title={selectedPlace.name}
						/>
					</>
				)}
			</GoogleMap>
		</LoadScript>
	) : (
		<div role="status">Google Maps is unavailable. Configure the map API key to enable location search.</div>
	);
};

export default MapContainer;
