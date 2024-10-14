import { useEffect, useRef, useState } from "react";
import mapboxgl, {
    Map,
    MapMouseEvent,
    GeoJSONSourceSpecification,
} from "mapbox-gl";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

interface MarkerData {
    id: number;
    lng: number;
    lat: number;
}

export default function Index() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const markerIdCounter = useRef(1); // Unique marker ID counter
    const [map, setMap] = useState<Map | null>(null);
    const [markers, setMarkers] = useState<Array<MarkerData>>([]);

    useEffect(() => {
        if (mapContainer.current) {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

            const initializedMap = new mapboxgl.Map({
                container: mapContainer.current!,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [46.6753, 24.7136], // Riyadh's coordinates
                zoom: 9,
            });

            initializedMap.on("load", () => {
                // Ensure the map is fully loaded before using it
                setMap(initializedMap);

                // Add zoom controls
                initializedMap.addControl(
                    new mapboxgl.NavigationControl(),
                    "top-left"
                );
            });

            return () => initializedMap.remove(); // Clean up the map instance when the component unmounts
        }
    }, []);

    // Function to handle map click and add a marker
    const handleMapClick = (event: MapMouseEvent) => {
        const { lng, lat } = event.lngLat;

        // Log coordinates to console
        console.log(`Pin added at Longitude: ${lng}, Latitude: ${lat}`);

        if (map) {
            const markerId = markerIdCounter.current++; // Get unique marker ID

            // Define the source specification for the marker
            const markerSource: GeoJSONSourceSpecification = {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [lng, lat],
                            },
                            properties: {
                                id: markerId,
                            },
                        },
                    ],
                },
            };

            // Add the GeoJSON source to the map with a unique ID
            map.addSource(`marker-source-${markerId}`, markerSource);

            // Add a layer for the marker
            map.addLayer({
                id: `marker-layer-${markerId}`,
                type: "symbol",
                source: `marker-source-${markerId}`,
                layout: {
                    "icon-image": "marker-15", // Default marker icon in Mapbox
                    "icon-size": 1.5,
                    "icon-allow-overlap": true,
                },
            });

            // Save the marker data in state
            setMarkers((prevMarkers) => [
                ...prevMarkers,
                { id: markerId, lng, lat },
            ]);
        }
    };

    // Attach event listener to the map
    useEffect(() => {
        if (map) {
            map.on("click", handleMapClick);

            return () => {
                map.off("click", handleMapClick);
            };
        }
    }, [map]);

    return (
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
            <div
                ref={mapContainer}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "10px",
                    borderRadius: "5px",
                }}
            >
                <h2 style={{color:"black"}}>Markers:</h2>
                <ul  style={{color:"black"}}>
                    {markers.map((marker) => (
                        <li key={marker.id}>
                            {`Marker ${marker.id}: Longitude: ${marker.lng.toFixed(
                                5
                            )}, Latitude: ${marker.lat.toFixed(5)}`}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
