import { MapContainer, TileLayer, Marker } from "react-leaflet";

interface Props {
  lat: number;
  lng: number;
}

export function PropertyMap({ lat, lng }: Props) {
  return (
    <MapContainer
      key={`${lat}-${lng}`} 
      center={[lat, lng]}
      zoom={15}
      style={{
        height: "400px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://openstreetmap.org{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
