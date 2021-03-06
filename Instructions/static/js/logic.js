var API_KEY = "pk.eyJ1Ijoia2VubmtuaXNsZXkiLCJhIjoiY2thNjFiejA4MDMzMDJ4b2VwNHZmZ2ZhbyJ9.hvX6G2b_LnYglPWg0ztqUw"

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.mapbox-streets-v8",
  accessToken: API_KEY
});

// var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.dark",
//   accessToken: API_KEY
// });

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
 layers: [streetmap] //, earthquakes]
});
streetmap.addTo(myMap);

// Perform a GET request to the query URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  createFeatures(data);
});

function createFeatures(earthquakeData) {
  function styleInfo(feature){
    return{
      opacity:1,
      fillOpacity:1,
      color: "#000000"
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
    pointToLayer: function(feature,latlng){
      return L.circleMarker(latlng);
    },
    style:styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: "+ feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap); 

  // Sending our earthquakes layer to the createMap function
 // createMap(earthquakes);
}

function createMap(earthquakes) { 

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
    // "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}