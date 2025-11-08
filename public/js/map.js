
  // Coordinates for Brighouse town center
  const brighouseCoords = [53.7010, -1.7840];

  const map = L.map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'bottomright'
    }
  }).setView(brighouseCoords, 15); // Zoom level 15 for street-level detail

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker at Brighouse
  L.marker(brighouseCoords).addTo(map)
    .bindPopup('Brighouse, Armitage Road, Clifton')
    .openPopup();
