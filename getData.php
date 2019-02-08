<?php
	
	$url = "http://dev.interactivemechanics.com/spit-spreads-death/cms/api/explorer?_format=json";
	
	$fp = fopen("./cache/data.json", "w");
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);
	
	$result = curl_exec($ch);
	if ($result){
		fwrite($fp, $result);
	}

	curl_close($ch);
	fclose($fp);
	
	print_r($result);