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
        'attribution': 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
    }).addTo(map);


    // Load JSON data:


}; // end FUNCTION createMap()


/*
// Create the desired markers:

	for (var i = 0; i < maps[map].markers.length; i += 1) {

		// Place the marker:
		_marker = L.marker([maps[map].markers[i].lat, maps[map].markers[i].lon], {
			'title': maps[map].markers[i].name
		}).addTo(_map);

		// Bind a popup to the marker:
		_popup = '<h2>' + maps[map].markers[i].name + '</h2><p>' + maps[map].markers[i].desc + '</p>';

		_marker.bindPopup( _popup );
	
	}; // end FOR i
*/