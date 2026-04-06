import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const PostsMap = ({ posts }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!posts) return;

    const extractLocations = async () => {
      const foundMarkers = [];

      const possibleLocations = [
        "Dubai",
        "Zefta",
        "Beirut",
        "Rome",
        "Paris",
        "Lebanon",
      ];

      for (const post of posts) {
        const text = post.content.replace(/<[^>]*>?/gm, " ");

        const locations = possibleLocations.filter((loc) =>
          text.toLowerCase().includes(loc.toLowerCase()),
        );

        for (const loc of locations) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${loc}`,
            );

            const data = await res.json();

            if (data.length > 0) {
              foundMarkers.push({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                title: post.title,
                location: loc,
                date: post.created_at, // 👈 add this
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
      }

      setMarkers(foundMarkers);
    };

    extractLocations();
  }, [posts]);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // you can customize
  };
  return (
    <MapContainer
      center={[33.8938, 35.5018]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
          <Popup>
            <strong>{m.title}</strong>
            <br />
            <small>{formatDate(m.date)}</small>
            <br />
            {m.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PostsMap;
