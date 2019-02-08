Data = (function() {	
	var cleanData = {
		"type": "FeatureCollection",
		"features": []
	};
	
	var init = function() {
		rewriteData();
    }
    
    var rewriteData = function() {
	    
	    // TODO: 
	    // FIGURE OUT OUR DATA STRUCTURE
	    // TRANSFORM OUR DATA INTO GEOJSON FORMAT
	    // AND SET IT AS DATA.CLEANDATA INSTEAD
	    
	    /*
	    $.each(data, function(index, value){
		    var lat;
		    var lon;
		    
		    var date = Date.parse(value.death_date);
		    var age = parseInt(value.age);
		    
		    if (value.lat) {
			    lat = value.lat;
		    } else {
			    lat = value.alt_lat;
		    }
		    
		    if (value.long) {
			    lon = value.long;
		    } else {
			    lon = value.alt_long;
		    }
		    
		    var newData = {
			    "type": "Feature",
			    "properties": {
				    "date": date,
				    "age": age,
				    "race": value.rabe,
				    "sex": value.sex,
				    "status": value.status
			    },
			    "geometry": {
				    "type": "Point",
				    "coordinates": [lon, lat]
			    }
		    };
		    
		    cleanData["features"].push(newData);
	    });
	    */
    }
    
    return {
        init: init,
        cleanData: cleanData
    }

})();
