var map = L.map('map').setView([-6.9175, 107.6191], 12);
L.tileLayer('https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=KP8XxRPzOszUwLbNmQud', {
    maxZoom: 23,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

fetch('busLinesData.geojson').then(response => response.json()).then(data => {
    
    var overlays = {};

    data.features.forEach(feature => {
        const lineName = feature.properties.name || "Bus Stops";
        const color = feature.properties.colour || "white";

        if (!overlays[lineName]) {
            overlays[lineName] = L.layerGroup().addTo(map);
        }

        L.geoJSON(feature, {


            pointToLayer: function(feature, latlng) {
                const marker = L.circleMarker(latlng, {
                    radius: 2,
                    color: "white"
                });
                
                if(feature.properties["@relations"][0]["stop_name"]){
                    marker.bindPopup(feature.properties["@relations"][0]["stop_name"]);
                } else if (feature.properties["@relations"][0]["role"] === "platform" && !(feature.properties["@relations"][0]["stop_name"])) {
                    return
                }
                else {
                    marker.bindPopup(feature.properties["@id"]); // CHANGE TO "STOP LATER"
                } 
                // TODO: BUS STOP

                return marker;
            },
            style: function() {
                return {
                    color: color,
                    weight: 4
                };
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(feature.properties.name);
                } 
            }
        }).addTo(overlays[lineName]);
    });

    L.control.layers(null, overlays).addTo(map);

})
.catch(error => console.log('Error loading GeoJSON data:', error));
