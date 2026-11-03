import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import classes from "./AccommodationMap.module.scss";
import { RoomResponse } from "../../types/axios/paging";
import { DEFAULT_TILE_ATTRIBUTION, DEFAULT_TILE_URL } from "../../utils/leaflet";

type AccommodationMapProps = {
	rooms: RoomResponse[];
	selectedAccommodationId: number | null;
	isMobileMapOpen: boolean;
	onSelect: (id: number | null) => void;
};

// Controls viewport, bounds fitting, and size invalidation
const MapBoundsController = ({
	rooms,
	selectedAccommodationId,
	isMobileMapOpen
}: {
	rooms: RoomResponse[];
	selectedAccommodationId: number | null;
	isMobileMapOpen: boolean;
}) => {
	const map = useMap();

	// Invalidate size on initial mount and when mobile toggle opens
	useEffect(() => {
		const timer = setTimeout(() => {
			map.invalidateSize();
		}, 150);
		return () => clearTimeout(timer);
	}, [map, isMobileMapOpen]);

	// Fit bounds whenever rooms data updates so all markers are visible
	useEffect(() => {
		if (rooms.length === 0) return;

		if (rooms.length === 1) {
			map.setView([rooms[0].latitude, rooms[0].longitude], 14);
			return;
		}

		const bounds = L.latLngBounds(rooms.map(r => [r.latitude, r.longitude] as [number, number]));
		if (bounds.isValid()) {
			map.fitBounds(bounds, {
				padding: [45, 45],
				maxZoom: 15
			});
		}
	}, [map, rooms]);

	// Pan to selected room if it's outside the visible view
	useEffect(() => {
		if (!selectedAccommodationId) return;
		const target = rooms.find(r => r.id === selectedAccommodationId);
		if (target && Number.isFinite(target.latitude) && Number.isFinite(target.longitude)) {
			const currentBounds = map.getBounds();
			if (!currentBounds.contains([target.latitude, target.longitude])) {
				map.panTo([target.latitude, target.longitude]);
			}
		}
	}, [map, rooms, selectedAccommodationId]);

	return null;
};

const createPriceIcon = (price: number, isSelected: boolean) => {
	return L.divIcon({
		className: "leaflet-price-badge",
		html: `<button type="button" class="${classes.marker} ${isSelected ? classes.markerSelected : ""}" aria-label="$${price} per night">$${price}</button>`,
		iconSize: [56, 30],
		iconAnchor: [28, 15]
	});
};

const AccommodationMap = ({ rooms, selectedAccommodationId, isMobileMapOpen, onSelect }: AccommodationMapProps): React.JSX.Element => {
	const roomsWithCoordinates = useMemo(
		() => rooms.filter(room => Number.isFinite(room.latitude) && Number.isFinite(room.longitude)),
		[rooms]
	);

	// Default center (Da Nang) if no coordinates available
	const initialCenter: [number, number] = useMemo(() => {
		if (roomsWithCoordinates.length > 0) {
			return [roomsWithCoordinates[0].latitude, roomsWithCoordinates[0].longitude];
		}
		return [16.07, 108.22];
	}, [roomsWithCoordinates]);

	return (
		<aside id="accommodation-map" className={`${classes.mapPanel} ${isMobileMapOpen ? classes.mapPanelOpen : ""}`} aria-label="Map of places to stay">
			<div className={classes.mapHeading}>
				<div className={classes.mapIcon}><LocationOnIcon fontSize="small" /></div>
				<div>
					<strong>Places around this area</strong>
					<span>{roomsWithCoordinates.length} locations on the map</span>
				</div>
			</div>
			<div className={classes.mapCanvas}>
				{roomsWithCoordinates.length > 0 ? (
					<MapContainer
						center={initialCenter}
						zoom={13}
						scrollWheelZoom={true}
						style={{ width: "100%", height: "100%" }}
					>
						<TileLayer
							attribution={DEFAULT_TILE_ATTRIBUTION}
							url={DEFAULT_TILE_URL}
						/>
						<MapBoundsController
							rooms={roomsWithCoordinates}
							selectedAccommodationId={selectedAccommodationId}
							isMobileMapOpen={isMobileMapOpen}
						/>
						{roomsWithCoordinates.map(room => (
							<Marker
								key={room.id}
								position={[room.latitude, room.longitude]}
								icon={createPriceIcon(room.price, room.id === selectedAccommodationId)}
								zIndexOffset={room.id === selectedAccommodationId ? 1000 : 0}
								eventHandlers={{
									click: () => onSelect(room.id)
								}}
							>
								<Popup>
									<div style={{ minWidth: "120px" }}>
										<strong style={{ display: "block", fontSize: "13px", color: "#172b3a", marginBottom: "4px" }}>
											{room.name}
										</strong>
										<span style={{ color: "#2f7668", fontWeight: 700, fontSize: "14px" }}>
											${room.price} / night
										</span>
									</div>
								</Popup>
							</Marker>
						))}
					</MapContainer>
				) : (
					<div className={classes.mapEmpty}>
						<LocationOnIcon />
						<span>The map will appear when accommodation locations are available.</span>
					</div>
				)}
			</div>
			<p className={classes.mapFootnote}>Select a price marker to locate a place.</p>
		</aside>
	);
};

export default AccommodationMap;
