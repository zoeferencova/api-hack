var map;

const apiKey = 'FoLAtKiesCRtw_6qZxcs';
const searchURL = 'https://wheelmap.org/api/nodes'

//initializing map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7128, lng: -74.0060},
	  zoom: 15
	});
	findBoundaries();
}

//formatting queries for request url
function formatQuery(params) {
	const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
	return queryItems.join('&')
}

//getting location information from WheelMap API
function getWheelMapNodes(bounds) {
	const params = {
		api_key: apiKey,
		bbox: bounds,
		per_page: 1000,
	}
	const options = {
		mode: 'no-cors'
	}
	const queryString = formatQuery(params)
	const url = `${searchURL}?${queryString}`
	fetch(url, options)
		.then(response => {
			console.log(response);
		})
		.catch(err => {
			console.log(err)
		});
}


//getting boundbox values for WheelMaps API and converting to proper format 
//(bbox=west,south,east,north) as comma separated float numbers wich are longitude, latitude values in degrees.
//runs whenever the map is moved and calls getWheelMapNodes function with new bounds
function findBoundaries() {
	google.maps.event.addListener(map, 'bounds_changed', function() {
	  	const bounds =  map.getBounds();
	  	const NE = bounds.getNorthEast();
		const SW = bounds.getSouthWest();
		const coordinates = [`${SW}`, `${NE}`];
		const fixed = coordinates.map(e => e.replace(/[{()}]/g, '')).map(e => e.split(', ')).flat();
		const parsed = fixed.map(e => parseFloat(e));
		[parsed[0], parsed[1]] = [parsed[1], parsed[0]];
		[parsed[2], parsed[3]] = [parsed[3], parsed[2]];
		const formattedBounds = parsed.join();
		getWheelMapNodes(formattedBounds);
	});
};

