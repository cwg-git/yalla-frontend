import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

// Fix default icon issue - CREATE ICON ONCE
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Default fallback (Beirut)
const DEFAULT_CENTER = [33.8938, 35.5018];

/* ---------------------------
   MARKER CLUSTER WITH SPIDERIFY
----------------------------*/
const MarkerClusterGroup = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    const mcg = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyDistanceMultiplier: 2,
    });

    markers.forEach((locationData) => {
      if (locationData.eventCount > 1) {
        const titles = locationData.titles || [locationData.title];
        
        titles.forEach((title, titleIndex) => {
          const angle = (titleIndex / titles.length) * Math.PI * 2;
          const radius = 0.00005;
          
          const lat = locationData.lat + radius * Math.cos(angle);
          const lng = locationData.lng + radius * Math.sin(angle);
          
          // Use default icon EXPLICITLY
          const marker = L.marker([lat, lng], { icon: defaultIcon });
          
          marker.bindPopup(`
            <div style="min-width: 200px;">
              <strong>${title}</strong>
              <br />
              <small>${locationData.date ? new Date(locationData.date).toLocaleDateString() : ''}</small>
              <br /><br />
              <b>Location:</b> ${locationData.location_original || ''}
              ${titles.length > 1 ? `<br/><br/><em>${titles.length} events at this location</em>` : ''}
            </div>
          `);
          
          mcg.addLayer(marker);
        });
      } else {
        const marker = L.marker([locationData.lat, locationData.lng], { icon: defaultIcon });
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <strong>${locationData.title}</strong>
            <br />
            <small>${locationData.date ? new Date(locationData.date).toLocaleDateString() : ''}</small>
            <br /><br />
            <b>Location:</b> ${locationData.location_original || ''}
          </div>
        `);
        
        mcg.addLayer(marker);
      }
    });

    map.addLayer(mcg);

    if (markers.length > 0) {
      const allLats = markers.map(m => m.lat);
      const allLngs = markers.map(m => m.lng);
      
      const bounds = L.latLngBounds(
        [[Math.min(...allLats), Math.min(...allLngs)], 
         [Math.max(...allLats), Math.max(...allLngs)]]
      );
      
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      });
    }

    return () => {
      map.removeLayer(mcg);
    };
  }, [markers, map]);

  return null;
};

const PostsMap = ({ posts }) => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    const postsArray = Array.isArray(posts) ? posts : posts?.data || [];
    
    if (!postsArray.length) {
      setMarkers([]);
      return;
    }

    const locationMap = new Map();

    postsArray.forEach((post) => {
      if (post.lat && post.lng && post.lat !== "null" && post.lng !== "null") {
        const key = `${parseFloat(post.lat).toFixed(5)},${parseFloat(post.lng).toFixed(5)}`;
        
        if (locationMap.has(key)) {
          const existing = locationMap.get(key);
          existing.eventCount += 1;
          existing.titles.push(post.title);
        } else {
          locationMap.set(key, {
            lat: parseFloat(post.lat),
            lng: parseFloat(post.lng),
            title: post.title,
            titles: [post.title],
            eventCount: 1,
            location_original: post.location,
            date: post.start_date || post.created_at,
          });
        }
      }
    });

    const found = Array.from(locationMap.values());
    setMarkers(found);

    if (found.length > 0) {
      setCenter([found[0].lat, found[0].lng]);
    }
  }, [posts]);

  const totalEvents = markers.reduce((sum, m) => sum + (m.eventCount || 1), 0);

  return (
    <div>
      {markers.length > 0 && (
        <div style={{ 
          marginBottom: '10px', 
          padding: '8px 12px', 
          background: '#f0f0f0', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <strong>{totalEvents}</strong> events at <strong>{markers.length}</strong> locations
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors, HOT"
        />

        <MarkerClusterGroup markers={markers} />
      </MapContainer>
    </div>
  );
};

export default PostsMap;