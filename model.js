function Company (data) {

	Company.HEADER_LINK = "Home Page";
	Company.HEADER_PHOTO = "Photo";
	Company.HEADER_COMPANY_NAME = "Company Name";
	Company.HEADER_CITY = "City";
	Company.HEADER_COUNTRY = "Country";
	Company.HEADER_FOUNDER = "Founder";
	Company.HEADER_LAT = "Garage Latitude";
	Company.HEADER_LONG = "Garage Longitude";

	Company.prototype.setData = function(data) {
		for (var attrname in data) { this[attrname] = data[attrname]; }
	}
	
	Company.prototype.getHTMLLink = function(label) {
		return '<a href="' + this[Company.HEADER_LINK] + '" target="_blank">' + (label ? label : 'Website') + '</a>';
	}
	
	Company.prototype.getHTMLImage = function(header) {
		return '<img src="' + this[(header ? header : Company.HEADER_PHOTO)] + '">';
	}
	
	Company.prototype.handleRichContent = function (header) {
		var field = this[header];
		
		if (header === Company.HEADER_PHOTO || 
			field.toLowerCase().endsWith('.jpg') || field.toLowerCase().endsWith('.png') ||
			field.toLowerCase().endsWith('.gif')) {
			return this.getHTMLImage(header);
			
		} else if (header === Company.HEADER_COMPANY_NAME) {
			return this.getHTMLLink(this[header]);
			
		} else {
			return this[header];
		}
	}
	 
	
	Company.prototype.getField = function(className, header, forMaps) {
		var content = this.handleRichContent(header),
			tagName = forMaps ? 'div' : 'td';
		
		if (forMaps) {
			return '<dt class="field_title ' + className + '">' + header + '</dt>' +
				'<dd class="field_description ' + className + '">' + content + '</dd>';
		} else {
			return '<td class="' + className + '"' +
				' originalValue="'+this[header]+'">' + content + '</td>';
		}
		return 
	}
	
	Company.prototype.getTitle = function() {
		return '<h3 class="company_name">' + this[Company.HEADER_COMPANY_NAME] + '</h3>';
	}
	
	Company.prototype.getHTMLDataRow = function() {
		var html = '<tr id="' + this["Id"] + '">';
		html += this.getField('photo', Company.HEADER_PHOTO);
		html += this.getField('company_name', Company.HEADER_COMPANY_NAME);
		html += this.getField('city', Company.HEADER_CITY);
		html += this.getField('country', Company.HEADER_COUNTRY);
		html += this.getField('founder', Company.HEADER_FOUNDER);
		html += '</tr>';
		return html;
	}
	
	this.setData(data);
	return this;
}