UI = (function() {
	
	// STORE RENDERING FOR MAP
	var map;
	var ctx;
	var geocoder;
	var gallery;
	
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
				} else if (term == 'Burial Sites') {
					el.style.backgroundImage = 'url(./assets/icon-burial.svg)';
				} else if (term == 'Housing') {
					el.style.backgroundImage = 'url(./assets/icon-housing.svg)';
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
	    $(document).on('click tap drag', '#list-panel-locations li', clickPointResult);
    }
    
    var closePanels = function() {
	    $('.side-panel').removeClass('active');
	    $('nav').removeClass('active');
	    $('nav button').removeClass('active');
	    $(this).addClass('active');
	    $('#detail-panel').html('');
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
	    
	    Analytics.sendAnalyticsScreen('Screen: "' + id + '" Panel');
	    Analytics.sendAnalyticsEvent('Panel', id, 'Open');
    }
    
    var openAttract = function() {
	    $('#intro').removeClass('d-none');
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
		
		gallery = $('#detail-panel').find('.paragraph--type--gallery');
		if (gallery) {
			gallery.find('.field__items').slick({
				dots: true,
				infinite: true,
				fade: true,
				prevArrow: '<svg version="1.1" id="slick-arrow-prev" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve"><path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554 c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587 c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/></svg>',
				nextArrow: '<svg version="1.1" id="slick-arrow-next" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.49 31.49" style="enable-background:new 0 0 31.49 31.49;" xml:space="preserve"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/></svg>'
			});
			
			gallery.find('.slick-slide .field--name-field-media-image img').each( function( index ) {
				var src = $(this).attr('src');
				$(this).parent().parent().attr('data-src', src);
			});
			
			gallery.lightGallery({
				selector: '.slick-slide .field--name-field-media-image',
				thumbnail: false,
				autoplay: false,
				autoplayControls: false,
				pager: false,
				share: false,
				actualSize: false,
				hash: false,
				hideBarsDelay: 150000,
				download: false,
				counter: false,
				fullScreen: false,
				nextHtml: '<svg version="1.1" id="slick-arrow-next" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.49 31.49" style="enable-background:new 0 0 31.49 31.49;" xml:space="preserve"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/></svg>',
				prevHtml: '<svg version="1.1" id="slick-arrow-prev" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve"><path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554 c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587 c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/></svg>'
			});
		}
		
		
		var certificate = $('#detail-panel').find('.paragraph--type--death-certificate');
		if (certificate) {
			var record = certificate.find('.field--name-field-death-certificate-record').remove();
			
			certificate.find('.media--type-image .field--name-field-media-image img').each( function( index ) {
				var src = $(this).attr('src');
				$(this).attr('data-src', src);
			});
			
			certificate.lightGallery({
				selector: '.media--type-image .field--name-field-media-image img',
				thumbnail: false,
				autoplay: false,
				autoplayControls: false,
				pager: false,
				share: false,
				actualSize: false,
				hash: false,
				hideBarsDelay: 150000,
				download: false,
				counter: false,
				fullScreen: false,
				nextHtml: '<svg version="1.1" id="slick-arrow-next" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.49 31.49" style="enable-background:new 0 0 31.49 31.49;" xml:space="preserve"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/></svg>',
				prevHtml: '<svg version="1.1" id="slick-arrow-prev" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve"><path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554 c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587 c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/></svg>'
			});
		}
		
		
		var chart = $('#detail-panel').find('.paragraph--type--pie-chart');
		chart.each( function( index ) {
			var data = {
				datasets: [{
					data: [],
					backgroundColor: [
		                'rgba(252, 247, 217, 1)',
		                'rgba(234, 173, 77, 1)',
		                'rgba(221, 120, 121, 1)',
		                'rgba(180, 110, 165, 1)',
		                'rgba(92, 101, 158, 1)',
		                'rgba(40, 78, 104, 1)'
		            ],
		            borderWidth: 0
    			}],
				labels: []
			};
			
			var rows = $(this).find('.paragraph--type--pie-chart-item');
			rows.each( function( index ) {
				var label = $(this).find('.field--name-field-chart-item-label .field__item').text();
				var number = $(this).find('.field--name-field-chart-item-per .field__item').text();
				
				data['labels'].push(label);
				data['datasets'][0]['data'].push(parseInt(number));
			});
			
			$(this).append('<canvas id="myChart" width="400" height="300"></canvas>');
			chart = new Chart($(this).find('#myChart'), {
			    type: 'doughnut',
			    data: data,
			    options: {
				    legend: {
					    fullWidth: false,
				    	position: 'right',
				    	labels: {
					    	boxWidth: 14,
					    	fontColor: '#FFF'
				    	}
				    },
				    tooltips: {
					    displayColors: false
				    },
				    layout: {
			            padding: {
			                left: 30,
			                right: 30,
			                top: 0,
			                bottom: 0
			            }
			        }
			    }
			});
		});
		
		var audio = $('#detail-panel').find('.paragraph--type--audio-file');
		audio.each( function( index ) {
			var source = $(this).find('source').attr('src');
			var title = $(this).find('.field--name-field-media-audio-title .field__label').text();
			var desc = $(this).find('.field--name-field-media-audio-title .field__item').text();
			
			var html  = '<div class="audio-player">';
				html += '	<div id="play-btn"></div>';
				html += '	<div class="audio-wrapper" id="player-container" href="javascript:;">';
				html += '		<audio id="player" ontimeupdate="UI.initProgressBar()">';
				html += '			<source src="' + source + '" type="audio/mp3">';
				html += '		</audio>';
				html += '	</div>'
				html += '	<div class="player-controls scrubber">';
				html += '		<p>' + desc + '</p>';
				html += '		<span id="seek-obj-container">';
				html += '			<progress id="seek-obj" value="0" max="1"></progress>';
				html += '		</span>';
				html += '		<small style="float: left; position: relative; left: 0;" id="start-time">00:00</small>';
				html += '		<small style="float: right; position: relative; right: 0;" id="end-time">00:00</small>';
				html += '	</div>';
				html += '</div>';
				
			$(this).find('.field--name-field-media-audio-file').html(html);
			initPlayers();
		});
		
		
		if (type) {
			UI.moveMapToLatLon(lat, lon, 16, 0, 45);
		} else {
			UI.moveMapToLatLon(lat, lon, 14, 0, 0);
		}
		
		Analytics.sendAnalyticsScreen('Screen: "Detail" Panel');
		Analytics.sendAnalyticsEvent('Panel', title, 'Open');
		
		if (type) {
			Analytics.sendAnalyticsEvent('Content', type);
		} else {
			Analytics.sendAnalyticsEvent('Content', 'neighborhood');
		}
    }
    
    var initProgressBar = function() {
		var player = document.getElementById('player');
		var length = player.duration
		var current_time = player.currentTime;

		// calculate total length of value
		var totalLength = calculateTotalValue(length)
		document.getElementById("end-time").innerHTML = totalLength;

		// calculate current value time
		var currentTime = calculateCurrentValue(current_time);
		document.getElementById("start-time").innerHTML = currentTime;

		var progressbar = document.getElementById('seek-obj');
		progressbar.value = (player.currentTime / player.duration);
		progressbar.addEventListener("click", seek);

		if (player.currentTime == player.duration) {
			document.getElementById('play-btn').className = "";
  		}

  		function seek(event) {
  			var percent = event.offsetX / this.offsetWidth;
  			player.currentTime = percent * player.duration;
  			progressbar.value = percent / 100;
  		}
	}

	var initPlayers = function() {
		var playerContainer = document.getElementById('player-container'),
		    player = document.getElementById('player'),
		    isPlaying = false,
		    playBtn = document.getElementById('play-btn');
		
	    if (playBtn != null) {
	    	playBtn.addEventListener('click', function() {
	          	togglePlay()
	    	});
	    }
	
		function togglePlay() {
			if (player.paused === false) {
			    player.pause();
			    isPlaying = false;
			    document.getElementById('play-btn').className = "";
			    
			    Analytics.sendAnalyticsEvent('Audio', 'Stop');
			} else {
			    player.play();
			    document.getElementById('play-btn').className = "pause";
			    isPlaying = true;
			    
			    Analytics.sendAnalyticsEvent('Audio', 'Start');
			}
		}
	}

	var calculateTotalValue = function(length) {
		var minutes = Math.floor(length / 60),
			seconds_int = length - minutes * 60,
			seconds_str = seconds_int.toString(),
			seconds = seconds_str.substr(0, 2),
			time = minutes + ':' + seconds

		return time;
	}

	var calculateCurrentValue = function(currentTime) {
		var current_hour = parseInt(currentTime / 3600) % 24,
			current_minute = parseInt(currentTime / 60) % 60,
			current_seconds_long = currentTime % 60,
			current_seconds = current_seconds_long.toFixed(),
			current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

		return current_time;
	}
    
    var destroyGallery = function() {
	    if (gallery){	    
		    gallery.data('lightGallery').destroy();
		}
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
		var address = $(this).data('tagline');
		var type = '';
	    
		openDetailPanel(title, type, address, content, lon, lat);
    }
    
    var clickPointResult = function() {
	    var lat = $(this).data('lat');
	    var lon = $(this).data('lon');
	    var content = $(this).data('content');
		var title = $(this).data('title');
		var address = $(this).data('address');
		var type = $(this).data('type');
	    
		openDetailPanel(title, type, address, content, lon, lat);
    }
    
    var scrollToTopOfPanel = function() {
	    $('.side-panel').animate({ scrollTop: 0 }, "fast");
    }
    
    var moveMapToLatLon = function(lat, lon, zoom, bearing, pitch, offset = 300) {
	    map.easeTo({
		    // These options control the ending camera position: centered at
			// the target, at zoom level 9, and north up.
			center: [lon, lat],
			offset: [offset, 0],
			zoom: zoom,
			bearing: bearing,
			 
			// These options control the flight curve, making it move
			// slowly and zoom out almost completely before starting
			// to pan.
			duration: 2000,
			pitch: pitch,
			 
			// This can be any easing function: it takes a number between
			// 0 and 1 and returns another number between 0 and 1.
			easing: function (t) { return t * (2 - t); }
		});
    }
    
    return {
        init: init,
        openAttract: openAttract,
        closePanels: closePanels,
        closeAttract: closeAttract,
        moveMapToLatLon: moveMapToLatLon,
        destroyGallery: destroyGallery,
        initProgressBar: initProgressBar
    }

})(mapboxgl);
