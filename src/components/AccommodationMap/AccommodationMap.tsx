import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import classes from "./AccommodationMap.module.scss";
import { RoomResponse } from "../../types/axios/paging";

const mapApiKey = import.meta.env.GOOGLE_MAPS_API_KEY;

type AccommodationMapProps = {
	rooms: RoomResponse[];
	selectedAccommodationId: number | null;
	isMobileMapOpen: boolean;
	onSelect: (id: number | null) => void;
};

type MapMarkerProps = {
	room: RoomResponse;
	selected: boolean;
	lat: number;
	lng: number;
	onSelect: (id: number) => void;
};

const MapMarker = ({ room, selected, lat, lng, onSelect }: MapMarkerProps): React.JSX.Element => (
	<button
		type="button"
		className={`${classes.marker} ${selected ? classes.markerSelected : ""}`}
		aria-label={`${room.name}, $${room.price} per night`}
		data-latitude={lat}
		data-longitude={lng}
		onClick={() => onSelect(room.id)}
	>
		${room.price}
	</button>
);

const AccommodationMap = ({ rooms, selectedAccommodationId, isMobileMapOpen, onSelect }: AccommodationMapProps): React.JSX.Element => {
	const roomsWithCoordinates = rooms.filter(room => Number.isFinite(room.latitude) && Number.isFinite(room.longitude));
	const center = roomsWithCoordinates.length
		? {
				lat: roomsWithCoordinates.reduce((total, room) => total + room.latitude, 0) / roomsWithCoordinates.length,
				lng: roomsWithCoordinates.reduce((total, room) => total + room.longitude, 0) / roomsWithCoordinates.length
			}
		: { lat: 16.07, lng: 108.15 };

	return (
		<aside id="accommodation-map" className={`${classes.mapPanel} ${isMobileMapOpen ? classes.mapPanelOpen : ""}`} aria-label="Map of places to stay">
			<div className={classes.mapHeading}>
				<span className={classes.mapIcon}><LocationOnIcon /></span>
				<div>
					<strong>Places around this area</strong>
					<span>{roomsWithCoordinates.length} locations on the map</span>
				</div>
			</div>
			<div className={classes.mapCanvas}>
				{roomsWithCoordinates.length > 0 && mapApiKey ? (
					<GoogleMapReact
						bootstrapURLKeys={{ key: mapApiKey }}
						center={center}
						defaultZoom={12}
						options={{ fullscreenControl: false, mapTypeControl: false, streetViewControl: false }}
					>
						{roomsWithCoordinates.map(room => (
							<MapMarker
								key={room.id}
								lat={room.latitude}
								lng={room.longitude}
								room={room}
								selected={room.id === selectedAccommodationId}
								onSelect={onSelect}
							/>
						))}
					</GoogleMapReact>
				) : (
					<div className={classes.mapEmpty}>
						<LocationOnIcon />
						<span>{roomsWithCoordinates.length ? "Map unavailable. Check the map API configuration." : "The map will appear when accommodation locations are available."}</span>
					</div>
				)}
			</div>
			<p className={classes.mapFootnote}>Select a price marker to locate a place.</p>
		</aside>
	);
};

export default AccommodationMap;
