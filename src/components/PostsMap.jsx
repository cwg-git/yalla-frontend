import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Default fallback (Beirut)
const DEFAULT_CENTER = [33.8938, 35.5018];

/* ---------------------------
   AUTO ZOOM COMPONENT
----------------------------*/
const MapAutoZoom = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    const bounds = L.latLngBounds(
      markers.map((m) => [m.lat, m.lng])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 12, // 👈 important (prevents too far zoom)
    });
  }, [markers, map]);

  return null;
};

const PostsMap = ({ posts }) => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    const postsArray = Array.isArray(posts)
      ? posts
      : posts?.data || [];

    if (!postsArray.length) {
      setMarkers([]);
      return;
    }

    const extractLocations = async () => {
      const found = [];

      for (const post of postsArray) {
        // ✅ 1. Already have coordinates
        if (post.lat && post.lng && post.lat !== "null" && post.lng !== "null") {
          found.push({
            lat: parseFloat(post.lat),
            lng: parseFloat(post.lng),
            title: post.title,

            // 👇 keep both languages
            location_original: post.location,
            location_en: post.location_en || post.location,

            date: post.start_date || post.created_at,
          });
          continue;
        }

        // ❌ no location
        if (!post.location) continue;

        // ✅ 2. Geocode fallback
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              post.location
            )}`
          );

          const data = await res.json();

          if (data?.length > 0) {
            found.push({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              title: post.title,

              location_original: post.location,
              location_en: data[0].display_name, // 👈 English-ish normalized

              date: post.start_date || post.created_at,
            });
          }
        } catch (e) {
          console.log("Geocode error:", e);
        }

        await new Promise((r) => setTimeout(r, 500));
      }

      setMarkers(found);

      if (found.length > 0) {
        setCenter([found[0].lat, found[0].lng]);
      }
    };

    extractLocations();
  }, [posts]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  attribution="© OpenStreetMap contributors, HOT"
/>

      {/* 🔥 AUTO ZOOM CONTROL */}
      <MapAutoZoom markers={markers} />

      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
          <Popup>
            <strong>{m.title}</strong>
            <br />
            <small>{formatDate(m.date)}</small>
            <br /><br />

            {/* ORIGINAL LANGUAGE */}
            <div>
              <b>Location:</b> {m.location_original}
            </div>

           
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PostsMap;