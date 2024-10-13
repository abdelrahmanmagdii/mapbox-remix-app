import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// mapbox access token
const MAPBOX_ACCESS_TOKEN = import.meta.env.MAPBOX_PUBLIC_TOKEN ;

export default function Index() {
    const mapContainer = useRef<HTMLDivElement>(null); // Ensuring mapContainer is of type HTMLDivElement and not null

    useEffect(() => {
        if (mapContainer.current) {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v11", // can use any map style
                center: [46.6753, 24.7136], // Riyadh's coordinates
                zoom: 9,
            });

            return () => map.remove(); // Clean up map instance when component unmounts
        }
    }, []);

    return (
        <div>
            <h1>Mapbox Example</h1>
            <div
                ref={mapContainer}
                style={{ width: "100%", height: "1100px" }}
            />
        </div>
    );
}
