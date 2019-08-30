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
				    "coordinates": [lon, lat],
				    "address": value.address,
				    "age": age,
				    
				    "first_name": value.first_name,
				    "last_name": value.last_name,
				    "middle_name": value.middle_name,
				    "prefix_name": value.prefix_name,
				    "suffix_name": value.suffix_name,
				    
				    "birth_place": value.birth_place,
				    "birth_date": value.birth_date,
				    "father_birthplace": value.father_birthplace,
				    "mother_birthplace": value.mother_birthplace,
				    "generation": value.generation,
				    
				    "death_date": date,
				    "death_address": value.death_address,
				    
				    "doctor_address": value.doctor_address,
				    "doctor_first": value.doctor_first,
				    "doctor_last": value.doctor_last,
				    "hospital_name": value.hospital_name,
				    
				    "burial_date": value.burial_date,
				    "burial_place": value.burial_place,
				    
				    "race": value.rabe,
				    "sex": value.sex,
				    "status": value.status,
				    "employer": value.employer,
				    "occupation": value.occupation
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
