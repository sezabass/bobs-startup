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

	var markers = {},
		infoWindows = {},
		activeInfoWindow;
	
	for (var i = 0, len = companies.length; i < len; i++) {
		var company = companies[i],
			companyId = company[Company.HEADER_ID],
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
		infoWindows[companyId] = infowindow;

		marker = new google.maps.Marker({
			position: {lat: companyLat, lng: companyLong},
			map: map,
			title: companies[i][Company.HEADER_COMPANY_NAME]
		});
		markers[companyId] = marker;
		
		console.log(marker);
	}
	
	for (var j in markers){
		markers[j].id = j;
		markers[j].addListener('click', function() {
			if (typeof(activeInfoWindow) !== 'undefined') {
				activeInfoWindow.close();
			}
			infoWindows[this.id].open(map, this);
			activeInfoWindow = infoWindows[this.id];
		});
	};
}