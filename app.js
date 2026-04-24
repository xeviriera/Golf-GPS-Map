// ===== FORATS =====
const holes = {
  1: {
    tee: { lat: 41.123, lng: 2.123 },
    greenCenter: { lat: 41.1245, lng: 2.1245 }
  }
};

// ===== MAPA =====
const map = L.map('map').setView([41.123, 2.123], 16);

// tiles (gratuït)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// ===== ICONES =====
const teeMarker = L.marker([0,0]).addTo(map).bindPopup("Tee");
const greenMarker = L.marker([0,0]).addTo(map).bindPopup("Green");
const userMarker = L.circleMarker([0,0], { radius: 8 }).addTo(map);

// línia jugador → green
const lineToGreen = L.polyline([], { dashArray: "5,5" }).addTo(map);

// ===== DISTÀNCIA =====
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon/2)**2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ===== ACTUALITZAR FORAT =====
function loadHole(holeId) {
  const hole = holes[holeId];

  teeMarker.setLatLng([hole.tee.lat, hole.tee.lng]);
  greenMarker.setLatLng([hole.greenCenter.lat, hole.greenCenter.lng]);

  map.fitBounds([
    [hole.tee.lat, hole.tee.lng],
    [hole.greenCenter.lat, hole.greenCenter.lng]
  ]);
}

// ===== TRACKING =====
navigator.geolocation.watchPosition(
  (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const holeId = document.getElementById("holeSelect").value;
    const hole = holes[holeId];

    // mou marcador jugador
    userMarker.setLatLng([lat, lng]);

    // línia al green
    lineToGreen.setLatLngs([
      [lat, lng],
      [hole.greenCenter.lat, hole.greenCenter.lng]
    ]);

    // distància
    const dist = getDistance(lat, lng, hole.greenCenter.lat, hole.greenCenter.lng);

    document.getElementById("distances").innerText =
      `Distància al centre del green: ${Math.round(dist)} m`;

  },
  (err) => console.error(err),
  {
    enableHighAccuracy: true,
    maximumAge: 1000
  }
);

// ===== INIT =====
loadHole(1);

// selector
document.getElementById("holeSelect").addEventListener("change", (e) => {
  loadHole(e.target.value);
});