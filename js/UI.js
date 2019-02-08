UI = (function() {
	
	// STORE RENDERING FOR MAP
	var map;
	var ctx;
	
	var init = function() {
		
		// BUILD THE BASIC MAP
		// SET THE INITIAL ZOOM AND LOCATION
		mapboxgl.accessToken = 'pk.eyJ1IjoiaW50ZXJhY3RpdmVtZWNoIiwiYSI6InJlcUtqSk0ifQ.RUwHuEkBbXoJ6SgOnXmYFg';
		map = new mapboxgl.Map({
		    container: 'map',
		    style: 'mapbox://styles/mapbox/light-v9',
		    zoom: 12,
			center: [-75.1204122, 39.9550073]
		});
		
		// WHEN THE MAP LOADS
		map.on('load', function () {
			
		});
		
        bindEvents();
    }
    
    var bindEvents = function() {
	    $(document).on('click tap drag', 'nav button', openPanel);
	    
	    $(document).on('click tap drag', '#intro-search', openPanel);
	    $(document).on('click tap drag', '#intro-explore', openPanel);
    }
    
    var closePanels = function() {
	    $('.side-panel').removeClass('active');
	    $('nav').removeClass('active');
	    $(this).addClass('active');
    }
    
    var openPanel = function() {
	    var id = $(this).data('id');
	    var isActive = $('#' + id).hasClass('active');
	    	    	    
	    closePanels();
	    closeAttract();
	    	    
	    if (!isActive) {
	    	$('#' + id).addClass('active');
	    	$('nav').addClass('active');
	    } else {
		    $('#' + id).removeClass('active');
		    $('nav').removeClass('active');
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
    
    var moveMapToLatLon = function(lat, lon, zoom) {
	    map.flyTo({
		    // These options control the ending camera position: centered at
			// the target, at zoom level 9, and north up.
			center: [lon, lat],
			zoom: zoom,
			bearing: 0,
			 
			// These options control the flight curve, making it move
			// slowly and zoom out almost completely before starting
			// to pan.
			speed: 1,
			curve: 1,
			 
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
