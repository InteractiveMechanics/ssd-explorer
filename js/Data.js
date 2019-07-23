Data = (function() {
	var cleanRecordData = {
		"type": "FeatureCollection",
		"features": []
	};
	var cleanPoiData = {
		"type": "FeatureCollection",
		"features": []
	};
	
	var init = function() {
		rewriteRecordData();
		rewritePoiData();
    }
    
    var rewriteRecordData = function() {
	    
	    // TRANSFORM OUR DATA INTO GEOJSON FORMAT
	    // AND SET IT AS DATA.CLEANDATA INSTEAD
	    $.each(data_records, function(index, value){
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
		    
		    cleanRecordData["features"].push(newData);
	    });
    }
    
    var rewritePoiData = function() {
	    
	    $.each(data_poi, function(index, value){
		    var lat = value.lat;
		    var lon = value.lon;
		    
		    var newData = {
			    "type": "Feature",
			    "properties": {
				    "type": value.type,
				    "address": value.address,
				    "content": value.content,
				    "title": value.title
			    },
			    "geometry": {
				    "type": "Point",
				    "coordinates": [lon, lat]
			    }
		    };
		    
		    cleanPoiData["features"].push(newData);
	    });
    }
    
    return {
        init: init,
        cleanRecordData: cleanRecordData,
        cleanPoiData: cleanPoiData
    }

})();
