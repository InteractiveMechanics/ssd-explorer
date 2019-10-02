Search = (function() {
	
	var source   = document.getElementById("single-search-tmpl").innerHTML;
	var template = Handlebars.compile(source);
	
	var name_source   = document.getElementById("single-name-search-tmpl").innerHTML;
	var name_template = Handlebars.compile(name_source);
	
	var person_source = document.getElementById("single-death-record-tmpl").innerHTML;
	var person_template = Handlebars.compile(person_source);
	
	var snapshot;
	
	var init = function() {
		snapshot = defiant.getSnapshot(Data.cleanRecordData);
		
        bindEvents();
        openKeyboard();
    }
    
    var bindEvents = function() {
	    $(document).on('submit', '#search-panel form', function() { return false; });
	    
	    $(document).on('change', '#search-input', searchFourquareVenues);
	    $(document).on('keypress', '#search-input', searchFourquareVenues);
	    $(document).on('click tap drag', '.search-icon', searchFourquareVenues);
	    
	    $(document).on('click tap drag', '.clear-search', clearSearchResults);
	    $(document).on('click tap drag', '#search-panel-results li.search-result-api', clickSearchAPIResult);
	    $(document).on('click tap drag', '#search-panel-results li.search-result-name', clickSearchNameResult);
    }
    
    var searchFourquareVenues = function(e) {
	    Utilities.resetTimeout();
	    
	    if (e.target == "svg#Capa_1" || e.type == "change" || (e.type == "keypress" && e.which == 13)){
		    if ( $('#search-input').val() != '' ) {
	            $('.clear-search').addClass('active');
	        } else {
	            $('.clear-search').removeClass('active');
	        }
	    
		    var q = $(this).val();
		    Analytics.sendAnalyticsEvent('Search', q);
		    
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
		    var fuzzy = "&fuzzyMatch=true";
		    var country = "&country=us";
		    var types = "&types=poi%2Caddress%2Cplace";
		    var bbox = "&bbox= -75.234444%2C%2039.908032%2C%20-75.038099%2C%2040.063454";
		    var limit = "&limit=5";
		    
		    if (q){			    
			    $.ajax({
				    // url: url + client + secret + v + query
				    url: url + query + token + cache + auto + fuzzy + country + types + bbox + limit
				})
				.done( function(data) {		
					// generate mapbox data as HTML
					var html = template(data);
					
					var dataSearch = defiant.search(snapshot, '//features/properties[contains(last_name, "' + q + '")]');
					var name_html = name_template(dataSearch.slice(0,5));
															
					$('#search-panel-results').html(name_html + html);
					hideSearchSuggestion();
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
    
    var clickSearchAPIResult = function() {
	    var lat = $(this).data('lat');
	    var lon = $(this).data('lon');
	    var title = $(this).data('title');
	    
	    UI.moveMapToLatLon(lat, lon, 16, 0, 0);
	    
	    Analytics.sendAnalyticsEvent('Search', title, 'Name');
    }
    
    var formatDate = function(date) {
	    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return monthNames[monthIndex] + ' ' + day  + ', ' + year;
	}
    
    var clickSearchNameResult = function() {
	    var lat = $(this).data('lat');
	    var lon = $(this).data('lon');
	    var name = $(this).data('name');
	    var address = $(this).data('address');
	    var age = $(this).data('age');
	    var birth_place = $(this).data('birth-place');
	    var birth_date = $(this).data('birth-date');
	    var father_birthplace = $(this).data('father-birthplace');
	    var mother_birthplace = $(this).data('mother-birthplace');
	    var generation = $(this).data('generation');
	    var death_date = $(this).data('death-date');
	    var death_address = $(this).data('death-address');
	    var doctor_address = $(this).data('doctor-address');
	    var doctor_name = $(this).data('doctor-name');
	    var hospital_name = $(this).data('hospital-name');
	    var burial_place = $(this).data('burial-place');
	    var burial_date = $(this).data('burial-date');
	    var race = $(this).data('race');
	    var sex = $(this).data('sex');
	    var status = $(this).data('status');
	    var occupation = $(this).data('occupation');
	    var employer = $(this).data('employer');
	    
	    if (race == "W") {
		    race = "European White";
	    } else if (race == "B") {
		    race = "African American";
	    } else if (race == "A") {
		    race = "Asian American";
	    } else if (race == "L") {
		    race = "Latinx";
	    } else if (race == "U") {
		    race = "Unknown";
	    }
	    
	    if (sex == "M") {
		    sex = "Male";
	    } else if (sex == "F") {
		    sex = "Female";
	    } else if (sex == "U") {
		    sex = "Unknown";
	    }
	    
	    if (status == "M") {
		    status = "Married";
	    } else if (status == "W") {
		    status = "Widowed";
	    } else if (status == "S") {
		    status = "Single";
	    } else if (status == "U") {
		    status = "Unknown";
	    }
	    
	    
	    if (birth_date != '' && birth_date !== '0000.00.00') {
		    var date = new Date(birth_date);
		    birth_date = formatDate(date);
	    } else {
		    birth_date = null;
	    }
	    
	    if (death_date != '' && death_date !== '0000.00.00') {
		    var date = new Date(death_date);
		    death_date = formatDate(date);
	    } else {
		    death_date = null;
	    }
	    
	    if (burial_date != '' && burial_date !== '0000.00.00') {
		    var date = new Date(burial_date);
		    burial_date = formatDate(date);
	    } else {
		    burial_date = null;
	    }
	    
	    
	    var data = {
		    "name": name,
		    "address": address,
		    "age": age,
		    "birth_place": birth_place,
		    "birth_date": birth_date,
		    "father_birthplace": father_birthplace,
		    "mother_birthplace": mother_birthplace,
		    "death_date": death_date,
		    "death_address": death_address,
		    "doctor_address": doctor_address,
		    "doctor_name": doctor_name,
		    "hospital_name": hospital_name,
		    "burial_place": burial_place,
		    "burial_date": burial_date,
		    "race": race,
		    "sex": sex,
		    "status": status,
		    "occupation": occupation,
		    "employer": employer
	    }
	    
	    var html = person_template(data);
		
		UI.closePanels();
	    UI.moveMapToLatLon(lat, lon, 17, 0, 0);
	    
	    $('nav').addClass('active');
		$('#detail-panel').html(html).addClass('active');
		
		Analytics.sendAnalyticsEvent('Search', name, 'Name');	    
    }
    
    var showSearchSuggestion = function() {
	    $('#search-panel-suggestions').removeClass('d-none');
    }
    var hideSearchSuggestion = function() {
	    $('#search-panel-suggestions').addClass('d-none');
    }
    
    var clearSearchResults = function() {
	    $('#search-input').val('');
	    $('#search-panel-results').html('');
	    
	    showSearchSuggestion();
	    UI.moveMapToLatLon(39.9502404, -75.1592545, 11.2, 0, 0, 300);
	    
	    Analytics.sendAnalyticsEvent('Search', 'Reset');
    }
    
    return {
        init: init,
        clearSearchResults: clearSearchResults,
        showSearchSuggestion: showSearchSuggestion
    }

})();
