Search = (function() {
	
	var source   = document.getElementById("single-search-tmpl").innerHTML;
	var template = Handlebars.compile(source);
	
	var init = function() {
        bindEvents();
        openKeyboard();
    }
    
    var bindEvents = function() {
	    $(document).on('submit', '#search-panel form', function() { return false; });
	    
	    $(document).on('change', '#search-input', searchFourquareVenues);
	    $(document).on('keypress', '#search-input', searchFourquareVenues);
	    
	    $(document).on('click tap drag', '.clear-search', clearSearchResults);
	    $(document).on('click tap drag', '#search-panel-results li', clickSearchResult);
    }
    
    var searchFourquareVenues = function(e) {	
	    if (e.type == "change" || (e.type == "keypress" && e.which == 13)){
		    if ( $('#search-input').val() != '' ) {
	            $('.clear-search').addClass('active');
	        } else {
	            $('.clear-search').removeClass('active');
	        }
	    
		    var q = $(this).val();
		    
		    /*
		    var url = "https://api.foursquare.com/v2/venues/search?near=" + encodeURI("Philadelphia, PA") + "&limit=10";
		    var client = "&client_id=YVXWACBWA4M3YKXBNV5SL23PZTZNR4BGPNFPTVGNBOPNNDYM";
		    var secret = "&client_secret=WU2RQOXOUN4RG5PXO2UWA5GEQ4VMS0YUM0NLPOO31SY3FQS4";
		    var v = "&v=" + "20190218";
		    var sw = "&sw=" + "-75.57334745185173,39.50731121765379";
		    var ne = "&sw=" + "-74.7409042144244,40.1510792131933";
		    var query = "&query=" + encodeURI(q);
		    */
		    
		    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
		    var query = encodeURI(q) + ".json";
		    var token = "?access_token=pk.eyJ1IjoiaW50ZXJhY3RpdmVtZWNoIiwiYSI6InJlcUtqSk0ifQ.RUwHuEkBbXoJ6SgOnXmYFg";
		    var cache = "&cachebuster=1565537598349";
		    var auto = "&autocomplete=true";
		    var country = "&country=us";
		    var types = "&types=poi%2Caddress%2Cplace";
		    var bbox = "&bbox=-75.57334745185173%2C%2039.50731121765379%2C%20-74.74090421442446%2C%2040.1510792131933";
		    var limit = "&limit=5";
		    
		    if (q){
			    $.ajax({
				    // url: url + client + secret + v + query
				    url: url + query + token + cache + auto + country + types + bbox + limit
				})
				.done( function(data) {
					var html = template(data);
					$('#search-panel-results').html(html);
				});
			}
		}
    }
    
    var openKeyboard = function() {
        $('#search-input').bind('keyboardChange', function (e, keyboard, el) {
            // Utilities.resetTimeout();
        })
        .keyboard({ 
            layout: 'custom',
            alwaysOpen: true,
            stayOpen: true,
            autoAccept : true,
            usePreview: false,
            position: false,
            reposition: false,
            appendTo: $('#search-panel'),
            customLayout: {
                'normal': [
	                '1 2 3 4 5 6 7 8 9 0',
                    'Q W E R T Y U I O P {b}',
                    'A S D F G H J K L {accept:Accept}',
                    'Z X C V B N M , . \'',
                    '{space} {left} {right} {undo:Undo} {redo:Redo} -'
                ]
            },
            display: {
                'b' : '\u232b:Delete',
                'enter': 'ENTER',
                'accept' : 'DONE',
                'space' : 'SPACE'
            }
        });
    }
    
    var clickSearchResult = function() {
	    var lat = $(this).data('lat');
	    var lon = $(this).data('lon');
	    
	    UI.moveMapToLatLon(lat, lon, 14);
    }
    
    var clearSearchResults = function() {
	    $('#search-input').val('');
	    $('#search-panel-results').html('');
    }
    
    return {
        init: init
    }

})();
