// ===== FORATS =====
const holes = {
  1: {
    tee: { lat: 41.802426, lng: 2.081614 },
    greenCenter: { lat: 41.800076, lng: 2.081701 }
  },
  2: {
    tee: { lat: 41.799921, lng: 2.081522 },
    greenCenter: { lat: 41.803540, lng: 2.081765 }
  },
  3: {
    tee: { lat: 41.803553, lng: 2.082770 },
    greenCenter: { lat: 41.801496, lng: 2.083035 }
  },
  4: {
    tee: { lat: 41.800919, lng: 2.082674 },
    greenCenter: { lat: 41.804055, lng: 2.082593 }
  },
  5: {
    tee: { lat: 41.803869, lng: 2.082405 },
    greenCenter: { lat: 41.803763, lng: 2.083781 }
  },
  6: {
    tee: { lat: 41.802190, lng: 2.085141 },
    greenCenter: { lat: 41.799869,  lng: 2.084980 }
  },
  7: {
    tee: { lat: 41.801077, lng: 2.084485 },
    greenCenter: { lat: 41.798473,  lng: 2.082167 }
  },
  8: {
    tee: { lat: 41.798356, lng: 2.082341 },
    greenCenter: { lat: 41.798004, lng: 2.081161 }
  },
  9: {
    tee: { lat: 41.799737, lng: 2.081798 },
    greenCenter: { lat: 41.802507, lng: 2.082120 }
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

// varaialbe global
let currentHoleId = 1; 


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

    const hole = holes[currentHoleId];
   

    // 👇 DISTÀNCIA AL CENTRE DEL GREEN
    const distance = getDistance(
      lat,
      lng,
      hole.greenCenter.lat,
      hole.greenCenter.lng
    );

    // UI
    document.getElementById("distances").innerText =
      `Centre del green: ${Math.round(distance)} m`;

  },
  (err) => console.error(err),
  {
    enableHighAccuracy: true
  }
);

// ===== INIT =====
loadHole(1);
setTimeout(() => {
  map.invalidateSize();
}, 200);


document.querySelectorAll(".holeBtn").forEach(btn => {
  btn.addEventListener("click", () => {

    // treure selecció anterior
    document.querySelectorAll(".holeBtn").forEach(b => b.classList.remove("active"));

    // marcar aquest
    btn.classList.add("active");

    // actualitzar forat actual
    currentHoleId = btn.dataset.id;

    // carregar forat al mapa
    loadHole(currentHoleId);
  });
});
