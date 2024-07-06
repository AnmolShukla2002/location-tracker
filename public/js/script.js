const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Anmol Shukla",
}).addTo(map);

const markers = {};
const polylines = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }

  if (polylines[id]) {
    polylines[id].addLatLng([latitude, longitude]);
  } else {
    polylines[id] = L.polyline([[latitude, longitude]], {
      color: "blue",
    }).addTo(map);
  }

  map.setView([latitude, longitude]);
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
  if (polylines[id]) {
    map.removeLayer(polylines[id]);
    delete polylines[id];
  }
});
