import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import L from "leaflet";

import { env } from "../config";
import { createIcon } from "../utils/mapIcons";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

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
        if (!isNaN(lat) && !isNaN(lng)) bounds.push([lat, lng]);
      });
    });
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      fitted.current = true;
    }
  }, [groups, selectedGroups, map]);

  return null;
};

const createClusterIcon = (iconUrl) =>
  L.divIcon({
    html: `<div class="cluster-icon"><img src="${iconUrl}" /></div>`,
    className: "custom-cluster",
    iconSize: L.point(46, 46),
  });

const MapsByCategorie = () => {
  const { key } = useParams();

  const [category, setCategory] = useState(null);
  const [groups, setGroups] = useState([]);
  const [cmsTimeline, setCmsTimeline] = useState([]);
  const [openGroups, setOpenGroups] = useState({});
  const [selectedGroups, setSelectedGroups] = useState({});
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const hasClusterBeenClicked = useRef(false);
  const mapRef = useRef(null);
  let currentHighlightTimeout = null;

  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/maps/grouped/${key}`)
      .then((res) => {
        setCategory(res.data.category_all);
        setGroups(res.data.groups);
        const open = {};
        const selected = {};
        res.data.groups.forEach((_, i) => {
          open[i] = true;
          selected[i] = true;
        });
        setOpenGroups(open);
        setSelectedGroups(selected);
      })
      .catch(console.error);
  }, [key]);

  useEffect(() => {
    if (!category?.id) return;
    axios
      .get(`${env.baseUrl}/api/mapscms/${category.id}`)
      .then((res) => {
        if (res.data.status === "success") setCmsTimeline(res.data.data);
      })
      .catch(console.error);
  }, [category]);

  const toggleGroupVisible = (index) => {
    setSelectedGroups((p) => ({ ...p, [index]: !p[index] }));
    setSelectedPoint(null);
  };

  // Highlight a marker by its Leaflet marker object
  const highlightMarker = (marker) => {
    if (!marker || !marker._icon) return;
    // Clear previous highlight
    if (currentHighlightTimeout) clearTimeout(currentHighlightTimeout);
    // Remove existing pulse class from any marker
    document.querySelectorAll('.marker-pulse').forEach(el => el.classList.remove('marker-pulse'));
    // Add pulse class
    marker._icon.classList.add('marker-pulse');
    currentHighlightTimeout = setTimeout(() => {
      if (marker._icon) marker._icon.classList.remove('marker-pulse');
    }, 1500);
  };

  const zoomToMarker = (p, groupName) => {
    if (!mapRef.current) return;
    const lat = +p.lat;
    const lng = +p.lng;
    
    mapRef.current.flyTo([lat, lng], 15, { duration: 0.8 });
    setSelectedPoint({
      name: p.title,
      type: groupName,
      lat: p.lat,
      lng: p.lng,
    });
    
    // After fly, find the marker by coordinates and open popup + highlight
    setTimeout(() => {
      let foundMarker = null;
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
          foundMarker = layer;
        }
      });
      if (foundMarker) {
        foundMarker.openPopup();
        highlightMarker(foundMarker);
      } else {
        console.warn("Marker not found for coordinates", lat, lng);
      }
    }, 900);
  };

  const handleClusterClick = (e) => {
    L.DomEvent.stopPropagation(e);
    if (e.originalEvent) e.originalEvent.preventDefault();
    e.preventDefault?.();

    if (clusteringEnabled && !hasClusterBeenClicked.current) {
      hasClusterBeenClicked.current = true;
      setClusteringEnabled(false);
      const center = e.layer.getLatLng();
      if (center && mapRef.current) {
        mapRef.current.flyTo([center.lat, center.lng], 12, { duration: 0.8 });
      }
    }
  };

  const backToFirstZone = () => {
    setClusteringEnabled(true);
    hasClusterBeenClicked.current = false;
    setTimeout(() => {
      if (mapRef.current && groups.length > 0) {
        const bounds = [];
        groups.forEach((group, index) => {
          if (!selectedGroups[index]) return;
          group.points.forEach((p) => {
            const lat = Number(p.lat);
            const lng = Number(p.lng);
            if (!isNaN(lat) && !isNaN(lng)) bounds.push([lat, lng]);
          });
        });
        if (bounds.length > 0) {
          mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
        } else {
          mapRef.current.setView([33.8547, 35.8623], 7);
        }
      }
    }, 300);
  };

  const defaultCenter = [33.8547, 35.8623];

  return (
    <>
      {category && (
        <section className="inner-banner">
          <div className="container">
            <div className="text-block">
              <h3><em>Map</em></h3>
              <h1><em>{category.name}</em></h1>
            </div>
          </div>
        </section>
      )}

      <section className="about-us">
        <div className="container">
          {category && (
            <div className="title-block text-center">
              <h2>{category.cat_healine}</h2>
              <ul>
                {category.first_tagline && (
                  <li><i className="far fa-check-circle"></i> {category.first_tagline}</li>
                )}
                {category.second_tagline && (
                  <li><i className="far fa-check-circle"></i> {category.second_tagline}</li>
                )}
              </ul>
            </div>
          )}

          <div className="map-block">
            <div id="sidebar">
              <div className="filter-title">{category?.name || "Map Categories"}</div>

               {/* CLUSTERING TOGGLE BUTTON */}
              {/* <div style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #ddd", marginBottom: "10px" }}>
                <button
                  onClick={() => setClusteringEnabled(!clusteringEnabled)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: clusteringEnabled ? "#dc3545" : "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  {clusteringEnabled ? "🔴 Disable Clustering" : "🟢 Enable Clustering"}
                </button>
                <p style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>
                  {clusteringEnabled
                    ? "Markers are grouped – click cluster to zoom"
                    : "Clustering OFF – click any marker directly for popup"}
                </p>
              </div> */}
              {/* {!clusteringEnabled && (
                <div style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    onClick={backToFirstZone}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    🔄 Back to 1st Zone
                  </button>
                </div>
              )} */}


              <div id="details">
                {!selectedPoint ? (
                  <p>Click a marker to see details.</p>
                ) : (
                  <>
                    <h3>{selectedPoint.name}</h3>
                    <p><strong>Type:</strong> {selectedPoint.type}</p>
                    <p><strong>Coordinates:</strong> {selectedPoint.lat}, {selectedPoint.lng}</p>
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
              <hr />
              <div className="map-category">
                {groups.map((group, groupIdx) => (
                  <div className="category" key={group.id}>
                    <div className="category-heading">
                      <input
                        type="checkbox"
                        checked={selectedGroups[groupIdx]}
                        onChange={() => toggleGroupVisible(groupIdx)}
                      />
                      <span
                        className="category-label"
                        onClick={() => setOpenGroups((p) => ({ ...p, [groupIdx]: !p[groupIdx] }))}
                      >
                        <label>{group.group_name}</label>
                      </span>
                    </div>
                    {openGroups[groupIdx] && (
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
            </div>

            <div id="map">
              <MapContainer
                center={defaultCenter}
                zoom={7}
                style={{ width: "100%", height: "100%" }}
                whenCreated={(map) => (mapRef.current = map)}
                preferCanvas={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                <FitBounds groups={groups} selectedGroups={selectedGroups} />

                {groups.map((group, gi) => {
                  if (!selectedGroups[gi]) return null;
                  const markerElements = group.points.map((p) => (
                    <Marker
                      key={`${group.id}-${p.id}`}
                      position={[+p.lat, +p.lng]}
                      icon={createIcon(`${env.baseUrl}/${group.icon_url}`)}
                      title={p.title}
                      alt={p.title}
                      eventHandlers={{
                        click: () =>
                          setSelectedPoint({
                            name: p.title,
                            type: group.group_name,
                            lat: p.lat,
                            lng: p.lng,
                          }),
                      }}
                    >
                      <Popup>{p.title}</Popup>
                    </Marker>
                  ));

                  if (!clusteringEnabled) {
                    return <React.Fragment key={group.id}>{markerElements}</React.Fragment>;
                  }

                  return (
                    <MarkerClusterGroup
                      key={group.id}
                      chunkedLoading
                      showCoverageOnHover={false}
                      maxClusterRadius={60}
                      iconCreateFunction={() => createClusterIcon(`${env.baseUrl}/${group.icon_url}`)}
                      eventHandlers={{ clusterclick: handleClusterClick }}
                    >
                      {markerElements}
                    </MarkerClusterGroup>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline">
        <div className="container">
          {cmsTimeline.map((item) => (
            <div className="block" key={item.id}>
              <h2>{item.headline}</h2>
              <div className="inner">
                <ul>
                  <li><i className="fa-solid fa-flag"></i> {item.firstline}</li>
                  <li><i className="fa-solid fa-location-dot"></i> {item.location}</li>
                  <li><i className="fa-solid fa-clipboard"></i> {item.thirdline}</li>
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