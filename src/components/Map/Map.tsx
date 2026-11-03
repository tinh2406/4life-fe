import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./Map.module.scss";
import { DEFAULT_TILE_ATTRIBUTION, DEFAULT_TILE_URL, createLocationPinIcon } from "../../utils/leaflet";

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

type SearchSuggestion = {
	label: string;
	lat: number;
	lng: number;
};

type PhotonFeature = {
	geometry: {
		coordinates: [number, number];
	};
	properties?: {
		name?: string;
		street?: string;
		city?: string;
		state?: string;
		country?: string;
	};
};

const MapEventsHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
	useMapEvents({
		click(e) {
			onMapClick(e.latlng.lat, e.latlng.lng);
		}
	});
	return null;
};

const MapCenterController = ({ center }: { center: [number, number] }) => {
	const map = useMap();
	useEffect(() => {
		map.setView(center, map.getZoom());
	}, [center, map]);
	return null;
};

const MapContainerComponent = ({ selectedPlace, setSelectedPlace }: MapProps): React.JSX.Element => {
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const searchContainerRef = useRef<HTMLDivElement>(null);

	const defaultCenter: [number, number] = useMemo(() => {
		if (selectedPlace?.geometry.location.lat && selectedPlace?.geometry.location.lng) {
			return [selectedPlace.geometry.location.lat, selectedPlace.geometry.location.lng];
		}
		return [16.07, 108.15]; // Da Nang default
	}, [selectedPlace?.geometry.location.lat, selectedPlace?.geometry.location.lng]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Debounced search using Photon / OpenStreetMap API
	useEffect(() => {
		const trimmed = searchQuery.trim();
		if (trimmed.length < 2) {
			setSuggestions([]);
			return;
		}

		const timer = setTimeout(async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=5`);
				if (!response.ok) return;
				const data = await response.json();

				if (Array.isArray(data.features)) {
					const items: SearchSuggestion[] = data.features.map((feature: PhotonFeature) => {
						const props = feature.properties || {};
						const parts = [props.name, props.street, props.city, props.state, props.country].filter(Boolean);
						return {
							label: parts.length > 0 ? parts.join(", ") : trimmed,
							lat: feature.geometry.coordinates[1],
							lng: feature.geometry.coordinates[0]
						};
					});
					setSuggestions(items);
					setIsDropdownOpen(items.length > 0);
				}
			} catch (err) {
				console.error("Geocoding search failed:", err);
			} finally {
				setIsLoading(false);
			}
		}, 350);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const handleSelectSuggestion = (item: SearchSuggestion) => {
		setSelectedPlace({
			geometry: {
				location: {
					lat: item.lat,
					lng: item.lng
				}
			},
			name: item.label
		});
		setSearchQuery(item.label);
		setIsDropdownOpen(false);
	};

	const handleMapClick = (lat: number, lng: number) => {
		setSelectedPlace({
			geometry: {
				location: {
					lat,
					lng
				}
			},
			name: selectedPlace?.name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
		});
	};

	const handleMarkerDragEnd = (e: L.DragEndEvent) => {
		const marker = e.target;
		const position = marker.getLatLng();
		setSelectedPlace({
			geometry: {
				location: {
					lat: position.lat,
					lng: position.lng
				}
			},
			name: selectedPlace?.name || `Location (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`
		});
	};

	const currentPosition = selectedPlace?.geometry.location.lat && selectedPlace?.geometry.location.lng
		? [selectedPlace.geometry.location.lat, selectedPlace.geometry.location.lng] as [number, number]
		: null;

	return (
		<div className={classes.mapWrapper}>
			<div className={classes.searchContainer} ref={searchContainerRef}>
				<form
					className={classes.searchInputWrapper}
					onSubmit={e => {
						e.preventDefault();
						if (suggestions.length > 0) {
							handleSelectSuggestion(suggestions[0]);
						}
					}}
				>
					<input
						type="text"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						onFocus={() => {
							if (suggestions.length > 0) setIsDropdownOpen(true);
						}}
						aria-label="Search for an address or place"
						placeholder={isLoading ? "Searching..." : "Search address or place name..."}
						className={classes.searchInput}
					/>
					<button type="submit" className={classes.searchButton} aria-label="Search">
						<SearchIcon fontSize="small" />
					</button>
				</form>

				{isDropdownOpen && suggestions.length > 0 && (
					<ul className={classes.dropdown}>
						{suggestions.map((item, index) => (
							<li
								key={`${item.lat}-${item.lng}-${index}`}
								className={classes.dropdownItem}
								onClick={() => handleSelectSuggestion(item)}
							>
								{item.label}
							</li>
						))}
					</ul>
				)}
			</div>

			<MapContainer
				center={defaultCenter}
				zoom={14}
				scrollWheelZoom={true}
				style={{ width: "100%", height: "100%" }}
			>
				<TileLayer
					attribution={DEFAULT_TILE_ATTRIBUTION}
					url={DEFAULT_TILE_URL}
				/>
				<MapCenterController center={defaultCenter} />
				<MapEventsHandler onMapClick={handleMapClick} />

				{currentPosition && (
					<Marker
						position={currentPosition}
						draggable={true}
						icon={createLocationPinIcon()}
						eventHandlers={{
							dragend: handleMarkerDragEnd
						}}
					>
						<Popup>
							<div>
								<strong>{selectedPlace?.name || "Selected Location"}</strong>
								<div style={{ fontSize: "11px", color: "#586970", marginTop: "2px" }}>
									{currentPosition[0].toFixed(5)}, {currentPosition[1].toFixed(5)}
								</div>
							</div>
						</Popup>
					</Marker>
				)}
			</MapContainer>

			<div className={classes.mapHint}>
				Click on the map or drag the pin to set the exact position
			</div>
		</div>
	);
};

export default MapContainerComponent;
