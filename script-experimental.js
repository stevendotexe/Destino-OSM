var map = L.map('map').setView([-6.9175, 107.6191], 12);
L.tileLayer('https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=KP8XxRPzOszUwLbNmQud', {
    maxZoom: 18,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

fetch('busLinesData.geojson').then(response => response.json()).then(data => {
    var overlays = {};
    data.features.forEach(function(feature) {
        if (feature.geometry.type === "LineString") {
            const color = feature.properties.colour || "gray";
            const layer = L.geoJSON(feature, {
                style: {
                    color: color,
                    weight: 4
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup("Route: " + feature.properties.name);
                    }
                }
            });
            overlays[feature.properties.name] = layer;
        }
    });

    L.control.layers(null, overlays).addTo(map);
})
.catch(error => console.log('Error loading GeoJSON data:', error));
