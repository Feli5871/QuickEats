import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Order } from "@shared/schema";
import L from "leaflet";

// Fix for default marker icon in Leaflet with explicit CDN paths
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DeliveryMapProps {
  order?: Order;
  center?: [number, number];
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

function MapEvents({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onLocationSelect) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
}

export default function DeliveryMap({ order, center = [40.6975, -74.2632], onLocationSelect, interactive = false }: DeliveryMapProps) {
  // Center coordinates represent Union, New Jersey
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(
    order ? [order.coordinates.lat, order.coordinates.lng] : center
  );

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    onLocationSelect?.(lat, lng);
  };

  return (
    <MapContainer
      center={markerPosition}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={markerPosition} icon={icon} />
      {interactive && <MapEvents onLocationSelect={handleLocationSelect} />}
    </MapContainer>
  );
}