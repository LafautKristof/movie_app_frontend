"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

type MapProps = {
    originCountries: string[]; // bv. ["US", "DE"]
};

export default function Map({ originCountries }: MapProps) {
    const [geoData, setGeoData] = useState<any>(null);
    console.log(originCountries);
    useEffect(() => {
        fetch("/geo/geojson.json")
            .then((res) => res.json())
            .then((data) => setGeoData(data));
    }, []);

    function styleFeature(feature: any) {
        const iso2 = feature.properties["ISO3166-1-Alpha-2"]?.toUpperCase();
        const iso3 = feature.properties["ISO3166-1-Alpha-3"]?.toUpperCase();
        const isHighlighted =
            originCountries.includes(iso2) || originCountries.includes(iso3);

        return {
            fillColor: isHighlighted ? "red" : "#cccccc",
            weight: 1,
            opacity: 1,
            color: "black",
            fillOpacity: isHighlighted ? 0.7 : 0.3,
        };
    }

    if (!geoData) return <p>Loading map...</p>;

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <GeoJSON data={geoData} style={styleFeature} />
        </MapContainer>
    );
}
