<?php
	
	$url_nabe = "http://dev.interactivemechanics.com/spit-spreads-death/cms/api/explorer/neighborhoods?_format=json";
	$url_poi = "http://dev.interactivemechanics.com/spit-spreads-death/cms/api/explorer/points?_format=json";
	
	
	// GET POI
	$fp = fopen("./cache/data_poi.json", "w");
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url_poi);
	
	$result = curl_exec($ch);
	if ($result){
		fwrite($fp, $result);
	}

	curl_close($ch);
	fclose($fp);
	
	
	// GET NABES
	$fp = fopen("./cache/data_neighborhoods.json", "w");
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url_nabe);
	
	$result = curl_exec($ch);
	if ($result){
		fwrite($fp, $result);
	}

	curl_close($ch);
	fclose($fp);
	