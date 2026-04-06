import L from "leaflet";

const iconCache = {};

export const createIcon = (icon) => {
  const iconUrl =
    icon?.url ||
    "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png";

  if (!iconCache[iconUrl]) {
    iconCache[iconUrl] = L.icon({
      iconUrl,
      iconSize: icon?.size || [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });
  }

  return iconCache[iconUrl];
};
