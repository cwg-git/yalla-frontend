import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { env } from "../config";
import { createIcon } from "../utils/mapIcons";

const DEFAULT_CENTER = [41.3874, 2.1686];

/**
 * Read-only map for blog-category pages: reuses an existing map-category's
 * points (same data MapsByCategorie.jsx shows), with no sidebar/filters.
 */
const PassiveCategoryMap = ({ mapSlug, eventSlug, guideSlug }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!mapSlug) return;
    axios
      .get(`${env.baseUrl}/api/maps/grouped/${mapSlug}`)
      .then((res) => setGroups(res.data.groups || []))
      .catch(console.error);
  }, [mapSlug]);

  if (!mapSlug) return null;

  const allPoints = groups.flatMap((group) =>
    group.points.map((p) => ({ ...p, group }))
  );
  const center = allPoints.length
    ? [+allPoints[0].lat, +allPoints[0].lng]
    : DEFAULT_CENTER;

  return (
    <div>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
        preferCanvas={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
        >
          {allPoints.map((p) => (
            <Marker
              key={`${p.group.id}-${p.id}`}
              position={[+p.lat, +p.lng]}
              icon={createIcon(`${env.baseUrl}/${p.group.icon_url}`)}
            >
              <Popup>
                {p.title}
                <br />
                {p.description}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {(eventSlug || guideSlug) && (
        <div className="btn-block" style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          {eventSlug && (
            <a className="programs-btn" href={`/event-category/${eventSlug}`}>
              Events
            </a>
          )}
          {guideSlug && (
            <a className="programs-btn" href={`/maps-category/${guideSlug}`}>
              Guide
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default PassiveCategoryMap;
