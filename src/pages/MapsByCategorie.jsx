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



const MapsByCategorie = () => {
  const { key } = useParams();

  const [category, setCategory] = useState(null);
  const [groups, setGroups] = useState([]);
  const [cmsTimeline, setCmsTimeline] = useState([]);
  const [openGroups, setOpenGroups] = useState({});
  const [selectedGroups, setSelectedGroups] = useState({});
  const [selectedPoint, setSelectedPoint] = useState(null);
 
 const mapRef = useRef(null);
 const [, force] = useState(0);
 const clusterRef = useRef(null);

  // const markersRef = useRef({});

  
  const selectedPointRef = useRef(null);
  const markerRegistry = useRef({});
  const [activePointId, setActivePointId] = useState(null);

  useEffect(() => {
    if (!activePointId) return;

    const sidebar = document.getElementById("sidebar");
    const el = document.querySelector(`[data-point-id="${activePointId}"]`);

    if (!sidebar || !el) return;

    requestAnimationFrame(() => {
      const top =
        el.offsetTop - sidebar.offsetTop - sidebar.clientHeight / 2;

      sidebar.scrollTo({
        top,
        behavior: "smooth",
      });
    });
  }, [activePointId]);

  const getGroupIcon = (groups, groupName) => {
    const group = groups.find(g => g.group_name === groupName);
    return group?.icon_url ? `${env.baseUrl}/${group.icon_url}` : "";
  };
  const setMap = (map) => {
    mapRef.current = map;
    force((x) => x + 1);
  };

  const onMarkerClick = (p, group) => {
    setSelectedPoint({
      name: p.title,
      description: p.description, // 👈 ADD THIS
      type: group.group_name,
      lat: p.lat,
      lng: p.lng,
    });
  };
const markerNodes = React.useMemo(() => {
  return groups.map((group, gi) =>
    selectedGroups[gi]
      ? group.points.map((p) => (
          <Marker
            key={`${group.id}-${p.id}`}
            position={[+p.lat, +p.lng]}
            icon={createIcon(`${env.baseUrl}/${group.icon_url}`)}
            groupName={group.group_name}
            ref={(ref) => {
              if (ref) markerRegistry.current[p.id] = ref;
            }}
            eventHandlers={{
              click: () => {
                setActivePointId(p.id);
                onMarkerClick(p, group);
              },
            }}
          >
            <Popup>{p.title}<br/>{p.description}</Popup>
          </Marker>
        ))
      : null
  );
}, [groups, selectedGroups]);



 

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

const zoomToMarker = (p, groupName) => {
  const map = mapRef.current;
  const marker = markerRegistry.current[p.id];
  console.log("MAP CALLED", map);

  if (!map) {
    console.warn("Map not ready yet");
    return;
  }

  const lat = +p.lat;
  const lng = +p.lng;

  map.flyTo([lat, lng], 17, {
    animate: true,
    duration: 0.8,
  });

  setSelectedPoint({
    name: p.title,
    type: groupName,
    lat,
    lng,
  });
  // 👇 THIS is the missing piece
  map.once("moveend", () => {
    const marker = markerRegistry.current[p.id];
    marker?.openPopup();
  });
};

const MapBinder = ({ setMap }) => {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map]);

  return null;
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
                              data-point-id={p.id}
                              className={activePointId === p.id ? "active-item" : ""}
                              onClick={() => {
                                setActivePointId(p.id);
                                zoomToMarker(p, group.group_name);
                              }}
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
                closePopupOnClick={false}
                zoom={7}
                style={{ width: "100%", height: "100%" }}
                // whenCreated={(map) => (mapRef.current = map)}
                preferCanvas={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                <FitBounds groups={groups} selectedGroups={selectedGroups} />
                <MapBinder setMap={setMap} />
                <MarkerClusterGroup
                  ref={clusterRef}
                  chunkedLoading
                  showCoverageOnHover={false}
                  maxClusterRadius={60}
                  spiderfyOnClick={true}
                  spiderfyOnMaxZoom={true}
                  spiderfyOnEveryZoom={false}
                  spiderfyDistanceMultiplier={1.4} 
                  // zoomToBoundsOnClick={false}
                  disableClusteringAtZoom={16}
                  removeOutsideVisibleBounds={true}
                  animate={true}
                  animateAddingMarkers={true}
                  iconCreateFunction={(cluster) => {
                    const markers = cluster.getAllChildMarkers();

                    const groupCount = {};

                    markers.forEach((m) => {
                      const group = m.options.groupName || "default";
                      groupCount[group] = (groupCount[group] || 0) + 1;
                    });

                    let dominantGroup = null;
                    let max = 0;

                    Object.keys(groupCount).forEach((g) => {
                      if (groupCount[g] > max) {
                        max = groupCount[g];
                        dominantGroup = g;
                      }
                    });

                    const iconUrl = getGroupIcon(groups, dominantGroup);

                    return L.divIcon({
                      html: `
                        <div class="cluster-icon">
                          ${iconUrl ? `<img src="${iconUrl}" />` : ""}
                          <span>${cluster.getChildCount()}</span>
                        </div>
                      `,
                      className: "custom-cluster",
                      iconSize: L.point(50, 50),
                    });
                  }}
                >
                 {markerNodes}
                </MarkerClusterGroup>
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
                  {item.firstline && (<li><i className="fa-solid fa-flag"></i> {item.firstline}</li>)}
                  {item.location && (<li><i className="fa-solid fa-location-dot"></i> {item.location}</li>)}
                  {item.thirdline && (<li><i className="fa-solid fa-clipboard"></i> {item.thirdline}</li>)}
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