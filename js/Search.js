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
	    
		    var q = $(this).val();
		    
		    var url = "https://api.foursquare.com/v2/venues/search?near=" + encodeURI("Philadelphia, PA") + "&limit=10";
		    var client = "&client_id=YVXWACBWA4M3YKXBNV5SL23PZTZNR4BGPNFPTVGNBOPNNDYM";
		    var secret = "&client_secret=WU2RQOXOUN4RG5PXO2UWA5GEQ4VMS0YUM0NLPOO31SY3FQS4";
		    var v = "&v=" + "20190218";
		    var query = "&query=" + encodeURI(q);
		    
		    if (q){
			    $.ajax({
					url: url + client + secret + v + query
				})
				.done( function(data) {
					var html = template(data["response"]);
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
