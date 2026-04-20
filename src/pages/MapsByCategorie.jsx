import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import L from "leaflet";

import { env } from "../config";
import { createIcon } from "../utils/mapIcons";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

/*********************************************************
 * FIT BOUNDS (run once)
 *********************************************************/
const FitBounds = ({ groups, selectedGroups }) => {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;

    const bounds = [];

    groups.forEach((group, index) => {
      if (!selectedGroups[index]) return;

      group.points.forEach((p) => {
        const lat = Number(p.lat);
        const lng = Number(p.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.push([lat, lng]);
        }
      });
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      fitted.current = true;
    }
  }, [groups, selectedGroups, map]);

  return null;
};

/*********************************************************
 * CLUSTER ICON (DYNAMIC)
 *********************************************************/
const createClusterIcon = (iconUrl) =>
  L.divIcon({
    html: `<div class="cluster-icon"><img src="${iconUrl}" /></div>`,
    className: "custom-cluster",
    iconSize: L.point(46, 46),
  });

/*********************************************************
 * MAIN COMPONENT
 *********************************************************/
const MapsByCategorie = () => {
  const { key } = useParams();

  const [category, setCategory] = useState(null);
  const [groups, setGroups] = useState([]);
  const [cmsTimeline, setCmsTimeline] = useState([]);

  const [openGroups, setOpenGroups] = useState({});
  const [selectedGroups, setSelectedGroups] = useState({});
  const [selectedPoint, setSelectedPoint] = useState(null);

  const mapRef = useRef(null);

  /**************** LOAD MAP DATA ****************/
  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/maps/grouped/${key}`)
      .then((res) => {
        setCategory(res.data.category_all);
        setGroups(res.data.groups);

        const open = {};
        const selected = {};
        const isSingle = res.data.groups.length === 1;

        res.data.groups.forEach((_, i) => {
          open[i] = isSingle ? true : false;   // auto open if only 1
          selected[i] = true;
        });

        setOpenGroups(open);
        setSelectedGroups(selected);
      })
      .catch(console.error);
  }, [key]);

  /**************** LOAD CMS TIMELINE ****************/
  useEffect(() => {
    if (!category?.id) return;

    axios
      .get(`${env.baseUrl}/api/mapscms/${category.id}`)
      .then((res) => {
        if (res.data.status === "success") {
          setCmsTimeline(res.data.data);
        }
      })
      .catch(console.error);
  }, [category]);

  const toggleGroupVisible = (index) => {
    setSelectedGroups((p) => ({ ...p, [index]: !p[index] }));
    setSelectedPoint(null);
  };

  const zoomToMarker = (p, groupName) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo([+p.lat, +p.lng], 13, { duration: 0.8 });

    setSelectedPoint({
      name: p.title,
      type: groupName,
      lat: p.lat,
      lng: p.lng,
      isCluster: false,
    });
  };

  const defaultCenter = [33.8547, 35.8623]; // Lebanon

  return (
    <>
      {/* ================= INNER BANNER ================= */}
      {category && (
        <section className="inner-banner">
          <div className="container">
            <div className="text-block">
              <h3>
                <em>Map</em>
              </h3>
              <h1>
                <em>{category.name}</em>
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* ================= MAP SECTION ================= */}
      <section className="about-us">
        <div className="container">
          {/* ===== TITLE BLOCK ===== */}
          {category && (
            <div className="title-block text-center">
              <h2>{category.cat_healine}</h2>
              <ul>
                {category.first_tagline && (
                  <li>
                    <i className="far fa-check-circle"></i>{" "}
                    {category.first_tagline}
                  </li>
                )}

                {category.second_tagline && (
                  <li>
                    <i className="far fa-check-circle"></i>{" "}
                    {category.second_tagline}
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="map-block">
            {/* ================= SIDEBAR ================= */}
            <div id="sidebar">
              <div className="filter-title">
                {category?.name || "Map Categories"}
              </div>

              <div className="map-category">
                {groups.map((group, index) => (
                  <div className="category" key={group.id}>
                    <div className="category-heading">
                      <input
                        type="checkbox"
                        checked={selectedGroups[index]}
                        onChange={() => toggleGroupVisible(index)}
                      />
                      <span
                        className="category-label"
                        onClick={() =>
                          setOpenGroups((p) => ({
                            ...p,
                            [index]: !p[index],
                          }))
                        }
                      >
                        <label>{group.group_name}</label>
                      </span>
                    </div>

                    {openGroups[index] && (
                      <div className="item-toggle">
                        <ul>
                          {group.points.map((p) => (
                            <li
                              key={`${p.id}-${p.group_id}`}
                              onClick={() => zoomToMarker(p, group.group_name)}
                            >
                              {p.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <hr />

              <div id="details">
                {!selectedPoint ? (
                  <p>Click a marker or cluster to see details.</p>
                ) : (
                  <>
                    <h3>{selectedPoint.name}</h3>
                    <p>
                      <strong>Type:</strong> {selectedPoint.type}
                    </p>
                    {selectedPoint.isCluster && selectedPoint.description && (
                      <p>
                        <strong>Info:</strong> {selectedPoint.description}
                      </p>
                    )}
                    <p>
                      <strong>Coordinates:</strong> {selectedPoint.lat},{" "}
                      {selectedPoint.lng}
                    </p>
                    <button
                      className="direction-btn"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`,
                          "_blank"
                        )
                      }
                    >
                      Get Directions
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ================= MAP ================= */}
            <div id="map">
              <MapContainer
                center={defaultCenter}
                zoom={7}
                style={{ width: "100%", height: "100%" }}
                whenCreated={(map) => (mapRef.current = map)}
                preferCanvas={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />

                <FitBounds groups={groups} selectedGroups={selectedGroups} />

                {groups.map(
                  (group, gi) =>
                    selectedGroups[gi] && (
                      <MarkerClusterGroup
  key={group.id}
  chunkedLoading
  showCoverageOnHover={false}
  disableClusteringAtZoom={16}
  spiderfyOnMaxZoom={true}
  zoomToBoundsOnClick={true}
  iconCreateFunction={() =>
    createClusterIcon(`${env.baseUrl}/${group.icon_url}`)
  }
  eventHandlers={{
    clusterclick: (cluster) => {
      const childMarkers = cluster.layer.getAllChildMarkers?.() || [];
      const pointCount = childMarkers.length;

      const groupNames = [
        ...new Set(childMarkers.map((m) => m.options.groupName)),
      ];

      const titles = childMarkers
        .slice(0, 3)
        .map((m) => m.options.title)
        .join(", ");

      let summary = `${pointCount} locations`;

      if (groupNames.length === 1) {
        summary += ` in "${groupNames[0]}"`;
      }

      if (titles) {
        summary += ` – includes: ${titles}${pointCount > 3 ? "…" : ""}`;
      }

      setSelectedPoint({
        name: `📍 Cluster (${pointCount} locations)`,
        type: groupNames.join(", ") || group.group_name,
        lat: cluster.layer.getLatLng().lat,
        lng: cluster.layer.getLatLng().lng,
        description: summary,
        isCluster: true,
      });
    },
  }}
>
                        {group.points.map((p) => (
                          <Marker
                            key={`${p.id}-${group.id}`}
                            position={[+p.lat, +p.lng]}
                            icon={createIcon(`${env.baseUrl}/${group.icon_url}`)}
                            eventHandlers={{
                              click: (e) => {
                                 L.DomEvent.stopPropagation(e); // 🔥 CRITICAL
                                setSelectedPoint({
                                  name: p.title,
                                  type: group.group_name,
                                  lat: p.lat,
                                  lng: p.lng,
                                  isCluster: false,
                                });
                                e.target.openPopup();
                              },
                            }}
                            // Attach metadata so cluster handler can read it
                            title={p.title}
                            options={{ title: p.title, groupName: group.group_name }}
                          >
                            <Popup>{p.title}</Popup>
                          </Marker>
                        ))}
                      </MarkerClusterGroup>
                    ),
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CMS TIMELINE ================= */}
      <section className="timeline">
        <div className="container">
          {cmsTimeline.map((item) => (
            <div className="block" key={item.id}>
              <h2>{item.headline}</h2>
              <div className="inner">
                <ul>
                  <li>
                    <i className="fa-solid fa-flag"></i> {item.firstline}
                  </li>
                  <li>
                    <i className="fa-solid fa-location-dot"></i> {item.location}
                  </li>
                  <li>
                    <i className="fa-solid fa-clipboard"></i> {item.thirdline}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default MapsByCategorie;