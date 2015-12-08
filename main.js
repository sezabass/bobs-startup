'use strict';

$(document).ready(function() {
	var $csvForm = $('form.csv_load'),
		$loadFromFile = $('.load_from_file');

	$csvForm.submit(function(e) {
		e.preventDefault();
		
		var csv = $csvForm[0].csv.value.trim();
		if (csv === "") {
			$loadFromFile.show();
		} else {
			processData(csv, $csvForm[0].separator.value);
			$loadFromFile.hide();
		}
	});
	
	$loadFromFile.find('.load_button').click(function(e) {
		loadSampleCSV();
		$loadFromFile.hide();
	});
	
});

// Load CSV from file
function loadSampleCSV() {
	$.ajax({
		type: "GET",
		url: "sample.csv",
		dataType: "text",
		success: function(data) {
			$('#field_csv').val(data);
			$('form').submit();
		}
	 });
}

// Read CSV
function processData(allText, selectedSeparator) {
	var allTextLines = allText.split(/\r\n|\n/),
		separators = {comma: ',', semicolon: ';', tab: '	'},
		separator = selectedSeparator ? separators[selectedSeparator] : ',',
		headers = allTextLines[0].split(separator),
		lines = [];

	if (allText.indexOf(separator)>=0) {
		for (var i=1; i<allTextLines.length; i++) {
			var data = allTextLines[i].split(separator);
			if (data.length == headers.length) {

				var tarr = [];
				for (var j=0; j<headers.length; j++) {
					tarr[headers[j].trim()] = data[j];
				}
				lines.push(tarr);
			}
		}
	}
	
	var companies = buildData(lines);
	buildTable(companies);
	initMap(companies);
}

// Build objects from CSV
function buildData(lines) {
	var companies = [];
	for (var i = 0, len = lines.length; i < len; i++) {
		var company = new Company(lines[i]);
		companies.push(company);
	}
	
	return companies;
}

// Put data in a table
function buildTable(companies) {
	var $table = $('#companies'),
		html = '';
		
	if (!companies.length) {
		$table.hide();
		return;
	}
	
	html += '<thead>';
	html += '<th class="show_marker">Marker</th>';
	html += '<th class="photo">Photo</th>';
	html += '<th class="company_name">Company Name</th>';
	html += '<th class="city">City</th>';
	html += '<th class="country">Country</th>';
	html += '<th class="founder">Founder</th>';
	html += '</thead><tbody>';
	
	for (var i = 0, len = companies.length; i < len; i++) {
		html += companies[i].getHTMLDataRow();
	}

	html += '</tbody>';
	
	$table.html(html);

	// Attach ordering function
	$table.find('th').not('.photo,.show_marker').on('click', function(e){
		orderBy(this);
	});
	
	$table.show();
}

// Table ordering function
function orderBy(el) {
	var $el = $(el),
		$thead = $el.closest('thead'),
		$tbody = $thead.next(),
		fields = {
			1: "Company Name",
			2: "City",
			3: "Country",
			4: "Founder"
		},
		index = $thead.find('th').index(el),
		$rootEls =  $tbody.find('tr'),
		direction = 1;
		
	/* Determine direction */
	if ( $tbody.data('sort') == fields[index] &&
			$tbody.data('direction') == 1) {
		direction = -1;
	}
	
	$rootEls.sort(function(a,b) {
		var elA = $(a).find('td').eq(index).attr('originalValue'),
			elB = $(b).find('td').eq(index).attr('originalValue');
		if (elA > elB)
			return 1 * direction;
		else if (elA < elB)
			return -1 * direction;
		return 0;
	});
		
	$tbody.data('sort', fields[index]).data('direction', direction);
	$tbody.html('').append($rootEls);
	
	$el.siblings().removeClass('ordered desc');
	$el.addClass('ordered');
	$el.toggleClass('desc', direction == -1);
}