function Company (data) {

	var LINK_HEADER = "Home Page",
		IMG_HEADER = "Photo",
		COMPANY_NAME_HEADER = "Company Name";

	Company.prototype.setData = function(data) {
		for (var attrname in data) { this[attrname] = data[attrname]; }
	}
	
	Company.prototype.getHTMLLink = function(label) {
		return '<a href="' + this[LINK_HEADER] + '" target="_blank">' + (label ? label : 'Website') + '</a>';
	}
	
	Company.prototype.getHTMLImage = function(header) {
		return '<img src="' + this[header] + '" height="80">';
	}
	
	Company.prototype.getField = function(className, header) {
		var field = this[header],
			content = '';
		
		if (header === IMG_HEADER || 
			field.toLowerCase().endsWith('.jpg') || field.toLowerCase().endsWith('.png') ||
			field.toLowerCase().endsWith('.gif')) {
			content = this.getHTMLImage(header);
			
		} else if (header === COMPANY_NAME_HEADER) {
			content = this.getHTMLLink(this[header]);
			
		} else {
			content = this[header];
		}
		
		return '<td class="' + className + '" originalValue="' + this[header] + '">' + content + '</td>';
	}
	
	Company.prototype.getHTMLDataRow = function() {
		var html = '<tr id="' + this["Id"] + '">';
		html += this.getField('photo', "Photo");
		html += this.getField('company_name', "Company Name");
		html += this.getField('city', 'City');
		html += this.getField('country', 'Country');
		html += this.getField('founder', 'Founder');
		html += '</tr>';
		return html;
	}
	
	this.setData(data);
	return this;
}