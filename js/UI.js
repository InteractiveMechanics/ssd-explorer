UI = (function() {
	
	// STORE RENDERING FOR MAP
	var map;
	var ctx;
	var geocoder;
	
	var source_list_neighborhood   = document.getElementById("list-neighborhood-tmpl").innerHTML;
	var template_list_neighborhood = Handlebars.compile(source_list_neighborhood);
	
	var source_list_poi   = document.getElementById("list-location-tmpl").innerHTML;
	var template_list_poi = Handlebars.compile(source_list_poi);
	
	var source_single_poi   = document.getElementById("single-poi-tmpl").innerHTML;
	var template_single_poi = Handlebars.compile(source_single_poi);
	
	var source_single_neighborhood   = document.getElementById("single-neighborhood-tmpl").innerHTML;
	var template_single_neighborhood = Handlebars.compile(source_single_neighborhood);
	
	var init = function() {
		
		// BUILD THE BASIC MAP
		// SET THE INITIAL ZOOM AND LOCATION
		mapboxgl.accessToken = 'pk.eyJ1IjoiaW50ZXJhY3RpdmVtZWNoIiwiYSI6InJlcUtqSk0ifQ.RUwHuEkBbXoJ6SgOnXmYFg';
		map = new mapboxgl.Map({
		    container: 'map',
		    style: 'mapbox://styles/mapbox/light-v9',
		    minZoom: 10,
		    zoom: 11.2,
			center: [-75.1592545, 39.9502404],
			minZoom: 11.2,
			maxBounds: [
				[-75.57334745185173, 39.50731121765379], // Southwest coordinates {"lng":-75.37334745185173,"lat":39.80731121765379}
				[-74.74090421442446, 40.1510792131933]  // Northeast coordinates {"lng":-74.74090421442446,"lat":40.1510792131933}
			]
		});
		
		// WHEN THE MAP LOADS
		map.on('load', function () {
			// LOAD THE GEOJSON FROM DATA.CLEANPOIDATA
			map.addSource('poi', {
				"type": "geojson",
				"data": Data.cleanPoiData
			});
			
			// LOAD THE GEOJSON FROM DATA.CLEANDATA
			map.addSource('deaths', {
				"type": "geojson",
				"data": Data.cleanRecordData
			});
			
			map.addSource('boundaries', {
				"type": "geojson",
				"data": data_boundaries
			});
			
			// ADD THE DATA AS A LAYER
			// AND STYLE THE POINTS
			map.addLayer({
				'id': 'death-circles',
				'type': 'circle',
				'source': 'deaths',
				"minzoom": 16,
				'paint': {
					'circle-color': '#FF0000',
					'circle-opacity': 0.2,
					'circle-radius': 5
				}
			});
			
			map.addLayer({
				'id': 'neighborhood-boundaries',
				'type': 'line',
				'source': 'boundaries',
				'paint': {
					'line-color': '#4A3323',
					'line-opacity': 0.25,
					'line-width': 2,
					'line-dasharray': [4, 3]
				}
			});
			
			Data.cleanPoiData.features.forEach(function(marker) {
				var term = marker.properties.type;
				var el = document.createElement('div');
				
				if (term == 'Community Story') {
					el.style.backgroundImage = 'url(./assets/icon-story.svg)';
				} else if (term == 'Landmark') {
					el.style.backgroundImage = 'url(./assets/icon-landmark.svg)';
				} else if (term == 'Hospital') {
					el.style.backgroundImage = 'url(./assets/icon-hospital.svg)';
				} else if (term == 'Death Certificate') {
					el.style.backgroundImage = 'url(./assets/icon-deathrecord.svg)';
				}
				
				// create a DOM element for the marker
				el.className = 'marker';
				el.style.width = '42.5px';
				el.style.height = '50px';
				el.style.backgroundSize = 'cover';
			 
				el.addEventListener('click', function() {					
					var coords = marker.geometry.coordinates.slice();
					var content = marker.properties.content;
					var address = marker.properties.address;
					var type = marker.properties.type;
					var title = marker.properties.title;
					
					openDetailPanel(title, type, address, content, coords[1], coords[0]);
				});
			 
				// add marker to map
				new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
			});
		});
		
        bindEvents();
        loadNeighborhoods();
        loadPoiList();
    }
    
    var bindEvents = function() {
	    $(document).on('click tap drag', 'nav button', openPanel);
	    
	    $(document).on('click tap drag', '#intro-search', openPanel);
	    $(document).on('click tap drag', '#intro-explore', openPanel);
	    
	    $(document).on('click tap drag', '#explore-panel-neighborhoods li', clickNeighborResult);
	    $(document).on('click tap drag', '#list-panel-locations li', clickPointResult)
    }
    
    var closePanels = function() {
	    $('.side-panel').removeClass('active');
	    $('nav').removeClass('active');
	    $('nav button').removeClass('active');
	    $(this).addClass('active');
	    
    }
    
    var openPanel = function() {
	    var id = $(this).data('id');
	    var isActive = $('#' + id).hasClass('active');
	    	    	    
	    closePanels();
	    closeAttract();
	    scrollToTopOfPanel();
	    	    
	    if (!isActive) {
	    	$('#' + id).addClass('active');
	    	$('nav').addClass('active');
	    	$('button[data-id="' + id + '"').addClass('active');
	    } else {
		    $('#' + id).removeClass('active');
		    $('nav').removeClass('active');
		    $('button[data-id="' + id + '"').removeClass('active');
	    }
    }
    
    var openAttract = function() {
	    ('#intro').removeClass('d-none');
	    setTimeout(function() {
		    $('#intro').addClass('show');
	    }, 100);
    }
    
    var closeAttract = function() {
	    $('#intro').removeClass('show');
	    setTimeout(function() {
		    $('#intro').addClass('d-none');
	    }, 500);
    }
    
    var openDetailPanel = function(title, type, address, content, lat, lon) {
	    closePanels();
	    scrollToTopOfPanel();
	    $('nav').addClass('active');
	    	    
	    var html = template_single_poi({ "title": title, "type": type, "address": address, "content": content });
		$('#detail-panel').html(html).addClass('active');
		
		var gallery = $('#detail-panel').find('.paragraph--type--gallery');
		if (gallery) {
			gallery.find('.field__items').slick({
				dots: true,
				infinite: true,
				fade: true,
				prevArrow: '<svg version="1.1" id="slick-arrow-prev" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve"><path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554 c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587 c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/></svg>',
				nextArrow: '<svg version="1.1" id="slick-arrow-next" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.49 31.49" style="enable-background:new 0 0 31.49 31.49;" xml:space="preserve"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/></svg>'
			});
		}
		
		UI.moveMapToLatLon(lat, lon, 16);
    }
    
    var loadNeighborhoods = function() {
	    var html = template_list_neighborhood(data_neighborhoods);
		$('#explore-panel-neighborhoods').html(html);
    }
    
    var loadPoiList = function() {
	    var html = template_list_poi(data_poi);
		$('#list-panel-locations').html(html);
    }
    
    var clickNeighborResult = function() {
	    var lat = $(this).data('lat');
	    var lon = $(this).data('lon');
	    var content = $(this).data('content');
		var title = $(this).data('title');
		var address = '';
		var type = '';
	    
	    UI.moveMapToLatLon(lat, lon, 13);
		openDetailPanel(title, type, address, content, lon, lat);
    }
    
    var clickPointResult = function() {
	    var lat = $(this).data('lat');
	    var lon = $(this).data('lon');
	    var content = $(this).data('content');
		var title = $(this).data('title');
		var address = $(this).data('address');
		var type = $(this).data('type');
	    
	    UI.moveMapToLatLon(lat, lon, 16);
		openDetailPanel(title, type, address, content, lon, lat);
    }
    
    var scrollToTopOfPanel = function() {
	    $('.side-panel').animate({ scrollTop: 0 }, "fast");
    }
    
    var moveMapToLatLon = function(lat, lon, zoom) {
	    map.easeTo({
		    // These options control the ending camera position: centered at
			// the target, at zoom level 9, and north up.
			center: [lon, lat],
			offset: [300, 0],
			zoom: zoom,
			bearing: 0,
			 
			// These options control the flight curve, making it move
			// slowly and zoom out almost completely before starting
			// to pan.
			speed: 3,
			curve: 2,
			 
			// This can be any easing function: it takes a number between
			// 0 and 1 and returns another number between 0 and 1.
			easing: function (t) { return t; }
		});
    }
    
    return {
        init: init,
        closePanels: closePanels,
        closeAttract: closeAttract,
        moveMapToLatLon: moveMapToLatLon
    }

})(mapboxgl);
