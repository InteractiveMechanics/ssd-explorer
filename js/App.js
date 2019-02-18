/**
 * Loads data and initializes all functions
 * Data is scoped as a global variable
 */


var data = function(){};

$(function(){

	var uri = './cache/data.json';

	$.getJSON(uri, function(response, status, jqXHR) {
		data = response;

		Utilities.init();
		Data.init();
		UI.init();
		Search.init();
		
	}, 'json');

});
