/*
*
* 	@author Kristofer Gryte. Copyright (c) 2013.
*
*
*	Desc:
*		PhantomJS script to convert JSON data to GeoJSON.
*
*
*
*/

// Utility to convert JSON to geoJSON (see the geoJSON specification: http://www.geojson.org)
function geoJSON( data ) {
	//
	// Input JSON data format:
	//	"original address": "string"
    //  "returned address": "string"
	//	"latitude": "number"
	//	"longitude": "number"
	//

	// Convert JSON data to GeoJSON:
	var _geoJSON = {
			'type': 'FeatureCollection',
			'features': [ ]
		};

	for (var i = 0; i < data.length; i++) {
		_geoJSON.features.push( {
			'type': 'Feature',
			'geometry': {
				'type': 'Point',
				'coordinates': [data[i].longitude, data[i].latitude] // [x,y]
			}, 
			'properties': {
				'name': data[i]['returned address']
			}
		});

	}; // end FOR i

	return _geoJSON;

}; // end FUNCTION geoJSON(data)


// Load the File System module:
var fs = require('fs');

// Read in the JSON file as text: https://github.com/ariya/phantomjs/wiki/API-Reference-FileSystem
var text = fs.read('../data/data.json');

// Convert text input to JSON:
var json = JSON.parse(text);

// Convert the JSON data to GeoJSON:
var geo_json = geoJSON(json);

// Write the data to file:
fs.write('../data/data.geojson', JSON.stringify(geo_json, null, '\t'), 'w');


// Quit Phantom JS:
phantom.exit();


