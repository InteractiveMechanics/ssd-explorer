/**
 * Loads data and initializes all functions
 * Data is scoped as a global variable
 */


var data_poi = function(){};
var data_neighborhoods = function(){};
var data_records = function(){};
var data_boundaries = function(){};

$(function(){

	var uri = './cache/data_poi.json';

	$.getJSON(uri, function(response, status, jqXHR) {
		data_poi = response;
		
		var uri = './cache/data_neighborhoods.json';
		
		$.getJSON(uri, function(response, status, jqXHR) {
			data_neighborhoods = response;
			
			var uri = './cache/data.json';
			
			$.getJSON(uri, function(response, status, jqXHR) {
				data_records = response;
				
				var uri = './assets/neighborhoods.geojson';
				
				$.getJSON(uri, function(response, status, jqXHR) {
					data_boundaries = response;
					
					Utilities.init();
					Data.init();
					UI.init();
					Search.init();
					
				}, 'json');
				
			}, 'json');
			
		}, 'json');
		
	}, 'json');
	

});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
