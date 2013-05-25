/**
*
*
*
*
*
*
*
*
*/


$(document).ready( createMap );


function createMap() {

	// Define initial parameters:

	    // location over which we will initially center the map
	var loc = {'lat': 40.754531, 'lon': -73.993113}, 
        // extent to which we are initially zoommed
        zoomLevel = 3, 
        // the maximum level of detail a user is allowed to see
        maxZoom = 15, 
        // id of the element in which we will place the map
        mapID = 'map'; 

    // Create the map object, setting the initial view:
    var map = L.map('map').setView(
        [loc.lat, loc.lon],
        zoomLevel
    );

    // Instantiate a tile layer, directing Leaflet to use the Open Street Map (OSM) API to access map tiles:
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        'maxZoom': maxZoom, 
        'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
    }).addTo(map);

    // Add a watercolor layer: http://maps.stamen.com/#terrain/12/37.7706/-122.3782
    // Comment this line out if you do not want a watercolor layer and remove the attribution above to Stamen Design.
    var watercolor = new L.StamenTileLayer("watercolor")
    	.addTo(map);


    // Load geoJSON data with jQuery:
    $.getJSON('data/data.json', function(data) {

    	// Use Leaflet to parse the data and display it as a layer on the map:
		L.geoJson(data, {
		    onEachFeature: function (feature, layer) {
		        layer.bindPopup(feature.properties.name);
		    }
		}).addTo(map);

	});


}; // end FUNCTION createMap()


