// Maps

var map;

function initMap(companies) {
	var companyLat = parseFloat(companies[0][Company.HEADER_LAT]),
		companyLong = parseFloat(companies[0][Company.HEADER_LONG]);

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: companyLat, lng: companyLong},
		zoom: 10
	});
	
	addMarkers(companies, map);
}

function addMarkers(companies, map) {

	var markers = [],
		infoWindows = [],
		activeInfoWindow;
	
	for (var i = 0, len = companies.length; i < len; i++) {
		var company = companies[i],
			companyLat = parseFloat(companies[i][Company.HEADER_LAT]),
			companyLong = parseFloat(companies[i][Company.HEADER_LONG]),
			infowindow, marker;

		var contentString = '<div class="content">'+
				company.getTitle() +
				'<div class="photo_wrapper">' + company.getHTMLImage() + '</div>' +
				'<div class="overlay"></div>' +
				'<div class="details">' +
				company.getField('city', Company.HEADER_CITY, true) +
				company.getField('country', Company.HEADER_COUNTRY, true) +
				company.getField('founder', Company.HEADER_FOUNDER, true) +
				'</div>' +
			'</div>';

		infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		infoWindows.push(infowindow);

		marker = new google.maps.Marker({
			position: {lat: companyLat, lng: companyLong},
			map: map,
			title: companies[i][Company.HEADER_COMPANY_NAME]
		});
		markers.push(marker);
	}
	
	for (var j = markers.length - 1; j >= 0; j--){
		markers[j].infoPos = j;
		markers[j].addListener('click', function() {
			if (typeof(activeInfoWindow) !== 'undefined') {
				activeInfoWindow.close();
			}
			infoWindows[this.infoPos].open(map, this);
			activeInfoWindow = infoWindows[this.infoPos];
		});
	};
}

function generateGeoJSON(companies) {
	var geoJSON = {
		type: 'FeatureCollection',
		features: []
	};
	for (var i = 0, len = companies.length; i < len; i++) {
		var company = companies[i],
			companyLat = parseFloat(companies[i][Company.HEADER_LAT]),
			companyLong = parseFloat(companies[i][Company.HEADER_LONG]);
			feature = {
				type: 'Feature',
				geometry: {type: 'Point', coordinates: [companyLat, companyLong]},
				properties: {name: companies[i][Company.HEADER_COMPANY_NAME]}
			};
		
		geoJSON.features.push(feature);
	}
	
	return geoJSON;
}