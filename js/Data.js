Data = (function() {	
	var cleanPoiData = {
		"type": "FeatureCollection",
		"features": []
	};
	
	var init = function() {
		rewritePoiData();
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
        cleanPoiData: cleanPoiData
    }

})();
