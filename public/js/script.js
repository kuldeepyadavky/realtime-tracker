// Initialize socket
let socket = io();

// Geolocation tracking
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      // console.log('position', position);
      const { longitude, latitude } = position.coords;
      socket.emit('send-location', { latitude, longitude });
    },
    (err) => {
      console.error('Error while getting geolocation: ', err);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}

// Initialize map
const map = L.map('map').setView([0, 0], 16); // Save map to a variable
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Updated URL format
  attribution: 'RealTime Tracker'
}).addTo(map);

// Track markers for different users
const markers = {};

// Handle location updates
socket.on('receive-location', (data) => {
  // console.log('data', data);
  const { id, latitude, longitude } = data;

  // Set map view to the latest received coordinates
  map.setView([latitude, longitude], 16);

  // Update marker position if it already exists; otherwise, create a new marker
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// Handle user disconnection
socket.on('user-disconnected', (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
